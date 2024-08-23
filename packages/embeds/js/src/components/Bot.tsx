import { LiteBadge } from './LiteBadge'
import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js'
import { isDefined, isNotDefined, isNotEmpty } from '@typebot.io/lib'
import { startChatQuery } from '@/queries/startChatQuery'
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
  const [initialChatReply, setInitialChatReply] = createSignal<
    StartChatResponse | undefined
  >()
  const [customCss, setCustomCss] = createSignal('')
  const [isInitialized, setIsInitialized] = createSignal(false)
  const [error, setError] = createSignal<Error | undefined>()

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

      <Show when={true} fallback={<></>}>
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

      <Show when={false} fallback={<></>}>
        <ConversationListContainer
          initialChatReply={props.initialChatReply}
          context={props.context}
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
