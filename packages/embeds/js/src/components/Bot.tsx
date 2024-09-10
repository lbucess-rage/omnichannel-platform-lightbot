import { LiteBadge } from './LiteBadge'
import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js'
import { isDefined, isNotDefined, isNotEmpty } from '@typebot.io/lib'
import { startChatQuery } from '@/queries/startChatQuery'
import { getResultsQueryByMemberId } from '@/queries/getResultsQuery'
import { ConversationContainer } from './ConversationContainer'
import { setIsMobile } from '@/utils/isMobileSignal'
import { BotContext, OutgoingLog } from '@/types'
import { ErrorMessage } from './ErrorMessage'
import {
  getExistingResultIdFromStorage,
  getInitialChatReplyFromStorage,
  setInitialChatReplyInStorage,
  setResultInStorage,
  wipeExistingChatStateInStorage,
} from '@/utils/storage'
import { setCssVariablesValue } from '@/utils/setCssVariablesValue'
import immutableCss from '../assets/immutable.css'
import {
  Font,
  InputBlock,
  ResultWithAnswers,
  ResultWithAnswersChatSessions,
  StartChatResponse,
  StartFrom,
} from '@typebot.io/schemas'
import { clsx } from 'clsx'
import { HTTPError } from 'ky'
import { injectFont } from '@/utils/injectFont'
import { ProgressBar } from './ProgressBar'
import { Portal } from 'solid-js/web'
import { defaultSettings } from '@typebot.io/schemas/features/typebot/settings/constants'
import { persist } from '@/utils/persist'
import { setBotContainerHeight } from '@/utils/botContainerHeightSignal'
import { currentMenuType } from '@/utils/currentMenuSignal'
import { ConversationListContainer } from './ConversationListContainer/ConversationListContainer'
import {
  defaultFontFamily,
  defaultFontType,
  defaultProgressBarPosition,
} from '@typebot.io/schemas/features/typebot/theme/constants'
import { CorsError } from '@/utils/CorsError'
import { Toaster, Toast } from '@ark-ui/solid'
import { CloseIcon } from './icons/CloseIcon'
import { toaster } from '@/utils/toaster'

export type BotProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typebot: string | any
  isPreview?: boolean
  resultId?: string
  prefilledVariables?: Record<string, unknown>
  apiHost?: string
  font?: Font
  progressBarRef?: HTMLDivElement
  startFrom?: StartFrom
  sessionId?: string
  onNewInputBlock?: (inputBlock: InputBlock) => void
  onAnswer?: (answer: { message: string; blockId: string }) => void
  onInit?: () => void
  onEnd?: () => void
  onNewLogs?: (logs: OutgoingLog[]) => void
  onChatStatePersisted?: (isEnabled: boolean) => void
}

export const Bot = (props: BotProps & { class?: string }) => {
  /**
   * case 별 props 상태
   * 1. 배포 URL로 접근
   * 2. 빌더 프리뷰에서 미리보기
   * 3. 테마, 설정에서 미리보기
   *
   */
  console.log(`before initializeBot Bot props:`, props)
  const [initialChatReply, setInitialChatReply] = createSignal<
    StartChatResponse | undefined
  >()
  const [customCss, setCustomCss] = createSignal('')
  const [isInitialized, setIsInitialized] = createSignal(false)
  const [error, setError] = createSignal<Error | undefined>()

  const [chatListByMemberId, setChatListByMemberId] = createSignal<
    ResultWithAnswersChatSessions[] | []
  >()

  // prefilledVariables 을 확인하여 memberId가 있는지 체크 후 존재하는 경우 해당 memberId로 result 테이브을 조회하여 최근 대화 목록을 가져옴
  // 해당 정보는 initializeBot 이전에 얻어옴
  const getResultsByMemberId = async () => {
    const urlParams = new URLSearchParams(location.search)
    const prefilledVariables: { [key: string]: string } = {}
    urlParams.forEach((value, key) => {
      prefilledVariables[key] = value
    })

    const isPreview =
      typeof props.typebot !== 'string' || (props.isPreview ?? false)
    // preview 모드에서는 memberId를 고정하여 prefilledVariables에 추가
    if (isPreview) {
      prefilledVariables.memberId = 'preview'
    }

    console.log(`getResultsByMemberId execute:`, prefilledVariables)
    if (prefilledVariables.memberId) {
      const memberId = prefilledVariables.memberId
      const limit = 10

      const results = await getResultsQueryByMemberId({ memberId, limit })
      if (results.data) {
        setChatListByMemberId(results.data.results)
      }

      console.log('results:', results)
    }
  }

  const initializeBot = async () => {
    console.log(`initializeBot props:`, props)

    if (props.font) injectFont(props.font)
    setIsInitialized(true)
    const urlParams = new URLSearchParams(location.search)
    props.onInit?.()
    const prefilledVariables: { [key: string]: string } = {}
    urlParams.forEach((value, key) => {
      prefilledVariables[key] = value
    })
    const typebotIdFromProps =
      typeof props.typebot === 'string' ? props.typebot : undefined
    const isPreview =
      typeof props.typebot !== 'string' || (props.isPreview ?? false)
    const resultIdInStorage = getExistingResultIdFromStorage(typebotIdFromProps)

    // preview 모드에서는 memberId를 고정하여 prefilledVariables에 추가
    if (isPreview) {
      prefilledVariables.memberId = 'preview'
    }

    const { data, error } = await startChatQuery({
      stripeRedirectStatus: urlParams.get('redirect_status') ?? undefined,
      typebot: props.typebot,
      apiHost: props.apiHost,
      isPreview,
      resultId: isNotEmpty(props.resultId) ? props.resultId : resultIdInStorage,
      prefilledVariables: {
        ...prefilledVariables,
        ...props.prefilledVariables,
      },
      startFrom: props.startFrom,
      sessionId: props.sessionId,
    })
    if (error instanceof HTTPError) {
      if (isPreview) {
        return setError(
          new Error(`챗봇 로딩과정에서 에러가 발생하였습니다.`, {
            cause: {
              status: error.response.status,
              body: await error.response.json(),
            },
          })
        )
      }
      if (error.response.status === 400 || error.response.status === 403)
        return setError(new Error('이 봇은 종료되었습니다.'))
      if (error.response.status === 404)
        return setError(new Error('라잇봇을 찾을 수 없습니다.'))
      return setError(
        new Error(
          `Error! 봇 초기화에 실패하였습니다. (${error.response.statusText})`
        )
      )
    }

    if (error instanceof CorsError) {
      return setError(new Error(error.message))
    }

    if (!data) {
      if (error) {
        console.error(error)
        if (isPreview) {
          return setError(
            new Error(`Error! 서버 연결 실패, 연결을 확인해보세요.`, {
              cause: error,
            })
          )
        }
      }
      return setError(new Error('Error! 서버 연결 실패, 연결을 확인해보세요.'))
    }

    if (
      data.resultId &&
      typebotIdFromProps &&
      (data.typebot.settings.general?.rememberUser?.isEnabled ??
        defaultSettings.general.rememberUser.isEnabled)
    ) {
      // 로컬(또는 세션) 스토리지에 resultId가 있고 이전 resultId와 다른 경우

      if (resultIdInStorage && resultIdInStorage !== data.resultId)
        // 해당 resultId를 스토리지에서 삭제
        wipeExistingChatStateInStorage(data.typebot.id)

      // Remember 설정의 Storage의 값을 가져옴
      const storage =
        data.typebot.settings.general?.rememberUser?.storage ??
        defaultSettings.general.rememberUser.storage
      // 해당 resultId를 스토리지에 저장
      setResultInStorage(storage)(typebotIdFromProps, data.resultId)

      // 초기 챗봇 상태를 스토리지에서 가져옴
      const initialChatInStorage = getInitialChatReplyFromStorage(
        data.typebot.id
      )

      // 초기 챗봇 상태가 있으면
      if (initialChatInStorage) {
        // 초기 챗봇 상태를 저장
        setInitialChatReply(initialChatInStorage)
      } else {
        // 초기 챗봇 상태가 없으면
        setInitialChatReply(data)
        setInitialChatReplyInStorage(data, {
          typebotId: data.typebot.id,
          storage,
        })
      }
      // 챗봇 상태를 저장했는지 여부를 true로 설정
      props.onChatStatePersisted?.(true)
    }
    // resultId가 존재하지 않거나 챗봇이 기억하기 설정이 비활성화된 경우
    // 보통 기억하기(rememberUser) 설정이 비활성화된 경우에 해당
    else {
      // 해당 resultId를 스토리지에서 삭제
      wipeExistingChatStateInStorage(data.typebot.id)

      // 리턴된 데이터를 signal로 저장

      setInitialChatReply(data)
      if (data.input?.id && props.onNewInputBlock)
        props.onNewInputBlock(data.input)
      if (data.logs) props.onNewLogs?.(data.logs)
      props.onChatStatePersisted?.(false)
    }

    setCustomCss(data.typebot.theme.customCss ?? '')
  }

  createEffect(() => {
    if (isNotDefined(props.typebot) || isInitialized()) return
    getResultsByMemberId().then()
    initializeBot().then()
  })

  createEffect(() => {
    if (isNotDefined(props.typebot) || typeof props.typebot === 'string') return
    setCustomCss(props.typebot.theme.customCss ?? '')
    if (
      props.typebot.theme.general?.progressBar?.isEnabled &&
      initialChatReply() &&
      !initialChatReply()?.typebot.theme.general?.progressBar?.isEnabled
    ) {
      setIsInitialized(false)
      getResultsByMemberId().then()
      initializeBot().then()
    }
  })

  onCleanup(() => {
    setIsInitialized(false)
  })

  return (
    <>
      <style>{customCss()}</style>
      <style>{immutableCss}</style>
      <Show when={error()} keyed>
        {(error) => <ErrorMessage error={error} />}
      </Show>
      {/*  초기화 후 'initialChatReply' signal이 변경되면 BotContent 컴포넌트를 렌더링 */}
      <Show when={initialChatReply()} keyed>
        {(initialChatReply) => (
          <BotContent
            class={props.class}
            initialChatReply={{
              ...initialChatReply,
              typebot: {
                ...initialChatReply.typebot,
                settings:
                  typeof props.typebot === 'string'
                    ? initialChatReply.typebot?.settings
                    : props.typebot?.settings,
                theme:
                  typeof props.typebot === 'string'
                    ? initialChatReply.typebot?.theme
                    : props.typebot?.theme,
              },
            }}
            context={{
              apiHost: props.apiHost,
              isPreview:
                typeof props.typebot !== 'string' || (props.isPreview ?? false),
              resultId: initialChatReply.resultId,
              sessionId: initialChatReply.sessionId,
              typebot: initialChatReply.typebot,
              storage:
                initialChatReply.typebot.settings.general?.rememberUser
                  ?.isEnabled &&
                !(
                  typeof props.typebot !== 'string' ||
                  (props.isPreview ?? false)
                )
                  ? initialChatReply.typebot.settings.general?.rememberUser
                      ?.storage ?? defaultSettings.general.rememberUser.storage
                  : undefined,
            }}
            chatListByMemberId={chatListByMemberId()}
            progressBarRef={props.progressBarRef}
            onNewInputBlock={props.onNewInputBlock}
            onNewLogs={props.onNewLogs}
            onAnswer={props.onAnswer}
            onEnd={props.onEnd}
          />
        )}
      </Show>
    </>
  )
}

type BotContentProps = {
  initialChatReply: StartChatResponse
  context: BotContext
  class?: string
  progressBarRef?: HTMLDivElement
  chatListByMemberId?: ResultWithAnswersChatSessions[]
  onNewInputBlock?: (inputBlock: InputBlock) => void
  onAnswer?: (answer: { message: string; blockId: string }) => void
  onEnd?: () => void
  onNewLogs?: (logs: OutgoingLog[]) => void
}
/**
 * 실제 챗봇의 콘텐츠를 렌더링하는 컴포넌트
 * 챗봇의 진행 상태(progress)를 저장하고, 이를 'ProgressBar' 컴포넌트에 전달
 * 'ConversationContainer' 컴포넌트를 렌더링하고, 챗봇의 상태를 업데이트하는 콜백 함수를 전달
 * 'ResizeObserver'를 사용하여 챗봇의 크기를 감지하고, 모바일 환경인지 여부를 식별
 */
const BotContent = (props: BotContentProps) => {
  console.log('BotContent props:', props)

  const [progressValue, setProgressValue] = persist(
    createSignal<number | undefined>(props.initialChatReply.progress),
    {
      storage: props.context.storage,
      key: `lightbot-${props.context.typebot.id}-progressValue`,
    }
  )
  let botContainer: HTMLDivElement | undefined
  /**
   * ResizeObserver를 사용하여 챗봇 컨테이너의 크기를 감지하고,
   * 모바일 환경인지 여부를 식별하는 함수입니다.
   * 컨테이너의 너비가 400보다 작으면 모바일로 간주합니다.
   */
  const resizeObserver = new ResizeObserver((entries) => {
    return setIsMobile(entries[0].target.clientWidth < 400)
  })

  // 챗봇 컨테이너가 마운트되면 ResizeObserver를 사용하여 크기를 감지하고, 높이를 설정합니다.
  onMount(() => {
    if (!botContainer) return
    resizeObserver.observe(botContainer)
    setBotContainerHeight(`${botContainer.clientHeight}px`)
  })

  createEffect(() => {
    injectFont(
      props.initialChatReply.typebot.theme.general?.font ?? {
        type: defaultFontType,
        family: defaultFontFamily,
      }
    )
    if (!botContainer) return
    setCssVariablesValue(
      props.initialChatReply.typebot.theme,
      botContainer,
      props.context.isPreview
    )
  })

  onCleanup(() => {
    if (!botContainer) return
    resizeObserver.unobserve(botContainer)
  })

  return (
    <div
      ref={botContainer}
      class={clsx(
        'relative flex w-full h-full text-base overflow-hidden flex-col justify-center items-center typebot-container',
        props.class
      )}
    >
      {/* 프로그레스바가 활성화되어 있을 때 렌더링 */}
      <Show
        when={
          isDefined(progressValue()) &&
          props.initialChatReply.typebot.theme.general?.progressBar?.isEnabled
        }
      >
        <Show
          when={
            props.progressBarRef &&
            (props.initialChatReply.typebot.theme.general?.progressBar
              ?.position ?? defaultProgressBarPosition) === 'fixed'
          }
          fallback={<ProgressBar value={progressValue() as number} />}
        >
          <Portal mount={props.progressBarRef}>
            <ProgressBar value={progressValue() as number} />
          </Portal>
        </Show>
      </Show>

      <Show
        when={!props.context.typebot.settings.homeUI?.isHomeUIEnabled ?? true}
        fallback={<></>}
      >
        <ConversationContainer
          context={props.context}
          initialChatReply={props.initialChatReply}
          onNewInputBlock={props.onNewInputBlock}
          onAnswer={props.onAnswer}
          onEnd={props.onEnd}
          onNewLogs={props.onNewLogs}
          onProgressUpdate={setProgressValue}
        />
      </Show>

      <Show
        when={props.context.typebot.settings.homeUI?.isHomeUIEnabled ?? false}
        fallback={<></>}
      >
        <ConversationListContainer
          initialChatReply={props.initialChatReply}
          context={props.context}
          chatListByMemberId={props.chatListByMemberId}
          menuType={currentMenuType()}
          onNewInputBlock={props.onNewInputBlock}
          onAnswer={props.onAnswer}
          onEnd={props.onEnd}
          onNewLogs={props.onNewLogs}
          onProgressUpdate={setProgressValue}
        />
      </Show>

      <Show
        when={
          props.initialChatReply.typebot.settings.general?.isBrandingEnabled
        }
      >
        <LiteBadge botContainer={botContainer} />
      </Show>
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root>
            <Toast.Title>{toast().title}</Toast.Title>
            <Toast.Description>{toast().description}</Toast.Description>
            <Toast.CloseTrigger class="absolute right-2 top-2">
              <CloseIcon class="w-4 h-4" />
            </Toast.CloseTrigger>
          </Toast.Root>
        )}
      </Toaster>
    </div>
  )
}
