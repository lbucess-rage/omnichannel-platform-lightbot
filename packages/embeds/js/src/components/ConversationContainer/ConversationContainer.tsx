import {
  ContinueChatResponse,
  InputBlock,
  Theme,
  ChatLog,
  StartChatResponse,
} from '@typebot.io/schemas'
import {
  createEffect,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from 'solid-js'
import { continueChatQuery } from '@/queries/continueChatQuery'
import { ChatChunk } from './ChatChunk'
import {
  Answer,
  BotContext,
  ChatChunk as ChatChunkType,
  OutgoingLog,
  ResponseMessage,
  WsPayloadType,
} from '@/types'
import { isNotDefined } from '@typebot.io/lib'
import { executeClientSideAction } from '@/utils/executeClientSideActions'
import { LoadingChunk } from './LoadingChunk'
import { PopupBlockedToast } from './PopupBlockedToast'
import { setStreamingMessage } from '@/utils/streamingMessageSignal'
import {
  formattedMessages,
  setFormattedMessages,
} from '@/utils/formattedMessagesSignal'
import { saveClientLogsQuery } from '@/queries/saveClientLogsQuery'
import { HTTPError } from 'ky'
import { persist } from '@/utils/persist'
import {
  connectChatServer,
  setConnectChatServer,
} from '@/utils/connectChatServerSignal'
import { eventChatServerSignal } from '@/utils/eventChatServerSignal'
import {
  sessionRequestChatServerSignal,
  setSessionRequestChatServerSignal,
} from '@/utils/sessionRequestChatServerSignal'
import { BubbleBlockType } from '@typebot.io/schemas/features/blocks/bubbles/constants'

const autoScrollBottomToleranceScreenPercent = 0.6
const bottomSpacerHeight = 128

const parseDynamicTheme = (
  initialTheme: Theme,
  dynamicTheme: ContinueChatResponse['dynamicTheme']
): Theme => ({
  ...initialTheme,
  chat: {
    ...initialTheme.chat,
    hostAvatar:
      initialTheme.chat?.hostAvatar && dynamicTheme?.hostAvatarUrl
        ? {
            ...initialTheme.chat.hostAvatar,
            url: dynamicTheme.hostAvatarUrl,
          }
        : initialTheme.chat?.hostAvatar,
    guestAvatar:
      initialTheme.chat?.guestAvatar && dynamicTheme?.guestAvatarUrl
        ? {
            ...initialTheme.chat.guestAvatar,
            url: dynamicTheme?.guestAvatarUrl,
          }
        : initialTheme.chat?.guestAvatar,
  },
})

type Props = {
  initialChatReply: StartChatResponse
  context: BotContext
  onNewInputBlock?: (inputBlock: InputBlock) => void
  onAnswer?: (answer: { message: string; blockId: string }) => void
  onEnd?: () => void
  onNewLogs?: (logs: OutgoingLog[]) => void
  onProgressUpdate?: (progress: number) => void
}

export const ConversationContainer = (props: Props) => {
  let chatContainer: HTMLDivElement | undefined
  let inputRef: HTMLInputElement | undefined
  const [chatChunks, setChatChunks, isRecovered, setIsRecovered] = persist(
    createSignal<ChatChunkType[]>([
      {
        input: props.initialChatReply.input,
        messages: props.initialChatReply.messages,
        clientSideActions: props.initialChatReply.clientSideActions,
      },
    ]),
    {
      key: `lightbot-${props.context.typebot.id}-chatChunks`,
      storage: props.context.storage,
      onRecovered: () => {
        setTimeout(() => {
          chatContainer?.scrollTo(0, chatContainer.scrollHeight)
        }, 200)
      },
    }
  )
  const [dynamicTheme, setDynamicTheme] = createSignal<
    ContinueChatResponse['dynamicTheme']
  >(props.initialChatReply.dynamicTheme)
  const [theme, setTheme] = createSignal(props.initialChatReply.typebot.theme)
  const [isSending, setIsSending] = createSignal(false)
  const [blockedPopupUrl, setBlockedPopupUrl] = createSignal<string>()
  const [hasError, setHasError] = createSignal(false)

  // 입력 조합중인지 여부 시그널
  const [isComposing, setIsComposing] = createSignal(false)

  // 채팅 상담 메세지 입력 영역 활성화 여부
  const [isInputActive, setIsInputActive] = createSignal(false)

  // 채팅 입력 메세지 저장
  const [chatMessage, setChatMessage] = createSignal('')

  // 상단 센터 정보 표시 여부
  const [isCenterInfoVisible, setIsCenterInfoVisible] = createSignal(false)

  // 컴포넌트가 DOM에 마운트된 후에 실행되는 훅
  // 초기 상태의 클라이언트 사이드 액션을 처리

  onMount(() => {
    ;(async () => {
      const initialChunk = chatChunks()[0]
      if (!initialChunk.clientSideActions) return

      // clientSideActions 배열에서 lastBubbleBlockId가 정의되지 않은 액션들을 추출
      // 이는 특정 조건을 만족하는 초기 상태의 클라이언트 사이드 액션을 처리하기 위함
      const actionsBeforeFirstBubble = initialChunk.clientSideActions.filter(
        (action) => isNotDefined(action.lastBubbleBlockId)
      )

      if (actionsBeforeFirstBubble.length > 0) {
        console.log('Actions before first bubble:', actionsBeforeFirstBubble)
      }
      // 필터링된 액션들을 처리
      await processClientSideActions(actionsBeforeFirstBubble)
    })()

    // setConnectChatServer(undefined)
  })

  // connectChatServer()가 변경되면 실행되는 효과
  createEffect(() => {
    if (connectChatServer()) {
      console.log('connectChatServer', connectChatServer())
    }
  })

  createEffect(() => {
    const newEvent = eventChatServerSignal() as ResponseMessage
    console.log('eventChatServerSignal', newEvent)
    if (!newEvent) return
    // if (newEvent) {
    //   console.log('eventChatServerSignal', newEvent)
    // }

    try {
      eventProcessing(newEvent)
    } catch (error) {
      console.error(`[WS-message] socket message event error`, error)
    }
  })

  const eventProcessing = (event: ResponseMessage) => {
    switch (event.action) {
      case WsPayloadType.CONNECT:
        console.log(`[SOCKET-(CONNECT)] event:`, event)
        console.log(
          `[SOCKET-(CONNECT)], callback call- session_request send event param`,
          {
            member: {
              sessionId: connectChatServer()?.customData.member.sessionId,
              userKey: connectChatServer()?.customData.member.userKey ?? '',
              memberId: connectChatServer()?.customData.member.memberId ?? '',
              clientId: props.context.typebot.id,
            },
          }
        )

        setIsInputActive(true)

        // session_request 이벤트 전송

        connectChatServer()!.sendSessionRequest({
          member: {
            sessionId: connectChatServer()?.customData.member.sessionId ?? '',
            userKey: connectChatServer()?.customData.member.userKey ?? '',
            memberId: connectChatServer()?.customData.member.memberId ?? '',
            userName: connectChatServer()?.customData.member.userName ?? '',
            clientId: props.context.typebot.id,
          },
        })

        break

      case WsPayloadType.DISCONNECT:
        console.log(`[SOCKET-(DISCONNECT)] event:`, event)
        setIsInputActive(false)
        break

      case WsPayloadType.SESSION_TERMINATE:
        console.log(`[SOCKET-(SESSION_TERMINATE)] event:`, event)
        setIsInputActive(false)
        connectChatServer()?.closeSocket()
        break

      case WsPayloadType.SESSION_CONFIRM:
        console.log(`[SOCKET-(SESSION_CONFIRM)] event:`, event)
        setSessionRequestChatServerSignal(event.sessionId)
        connectChatServer()?.sendUserAgentOpenAction()
        break

      // 상담사 응답 메세지 처리 필요
      case WsPayloadType.AGENT_START_RESPONSE:
        console.log(`[SOCKET-(AGENT_START_RESPONSE)] event:`, event)
        break

      case WsPayloadType.STATUS_CHANGE_EVENT:
        console.log(`[SOCKET-(STATUS_CHANGE_EVENT)] event:`, event)
        break

      case WsPayloadType.AGENT_RESPONSE:
        console.log(`[SOCKET-(AGENT_RESPONSE)] event:`, event)
        break

      case WsPayloadType.USER_MESSAGE:
        console.log(`[SOCKET-(USER_MESSAGE)] event:`, event)
        break

      default:
        console.log(`[SOCKET-(DEFAULT)] event:`, event)
        break
    }
  }

  // 채팅 메세지 전송 핸들러
  const handleMessageSend = async () => {
    if (!chatMessage()) return
    if (!connectChatServer()) return

    const message = {
      text: chatMessage(),
      sender: connectChatServer()?.customData.member.userKey ?? '',
      memberId: connectChatServer()?.customData.member.memberId ?? '',
      // channelId: connectChatServer()?.customData.member.sessionId ?? '',
      channelId:
        sessionRequestChatServerSignal() ??
        connectChatServer()?.customData.member.sessionId,
      clientId: props.context.typebot.id,
      sendAt: new Date().getTime().toString(),
    }

    connectChatServer()?.sendUserMessage(message)
    setChatMessage('')
    inputRef?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey && !isComposing()) {
      event.preventDefault() // 기본 Enter 동작(줄바꿈) 방지
      handleMessageSend() // 메시지 전송 처리
    }
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  // executeClientSideAction 함수의 onMessageStream 콜백 함수으로 사용
  // 스트리밍 메세지를 처리하는 함수
  const streamMessage = ({ id, message }: { id: string; message: string }) => {
    setIsSending(false)
    // chatChunks에서 현재 저장된 청크 배열을 복사하여 마지막 청크를 가져옴
    // 배열을 복사하여 직접 수정하지 않고 새로운 배열을 생성
    const lastChunk = [...chatChunks()].pop()

    // 마지막 청크가 존재하지 않는 경우 함수 종료, 이는 메세지를 추가할 대상 청크가 없음을 의미
    if (!lastChunk) return

    // 마지막 청크의 'streamingMessageId'가 현재 스트리밍 메세지의 id와 다른 경우
    // 새로운 청크를 생성하여 chatChunks에 추가, 새로운 청크는 빈 메세지 배열과 스트리밍 메세지 id를 가짐
    // setChatChunks 함수를 사용하여 chatChunks 상태를 업데이트
    if (lastChunk.streamingMessageId !== id)
      setChatChunks((displayedChunks) => [
        ...displayedChunks,
        {
          messages: [],
          streamingMessageId: id,
        },
      ])

    // 스트리밍 메세지를 저장
    setStreamingMessage({ id, content: message })
  }

  createEffect(() => {
    setTheme(
      parseDynamicTheme(props.initialChatReply.typebot.theme, dynamicTheme())
    )
  })

  const saveLogs = async (clientLogs?: ChatLog[]) => {
    if (!clientLogs) return
    props.onNewLogs?.(clientLogs)
    if (props.context.isPreview) return
    await saveClientLogsQuery({
      apiHost: props.context.apiHost,
      sessionId: props.initialChatReply.sessionId,
      clientLogs,
    })
  }

  const sendMessage = async (
    message?: string,
    attachments?: Answer['attachments']
  ) => {
    // 복구 상태 여부 false 설정
    setIsRecovered(false)
    //에러 상태 초기화
    setHasError(false)

    // chatChunks에서 현재 입력 블록을 가져옴
    const currentInputBlock = [...chatChunks()].pop()?.input

    // 만약 onAnswer 콜백이 제공되고 현재 입력 블록과 메시지가 존재한다면, 해당 콜백을 호출하여 메시지와 블록 ID를 전달합니다. 이 콜백은 부모 컴포넌트나 상위 로직에서 특정 작업(예: 메시지 로깅)을 수행하는 데 사용될 수 있습니다.
    if (currentInputBlock?.id && props.onAnswer && message)
      props.onAnswer({ message, blockId: currentInputBlock.id })

    // 0.5초후에 메세지 전송중 상태로 변경
    const longRequest = setTimeout(() => {
      setIsSending(true)
    }, 500)

    // 새로 전송된 메세지가 보이도록 스크롤을 자동으로 아래로 이동
    autoScrollToBottom()

    // continueChatQuery 함수를 사용하여 채팅 메세지 전송
    const { data, error } = await continueChatQuery({
      apiHost: props.context.apiHost,
      sessionId: props.initialChatReply.sessionId,
      message: message
        ? {
            type: 'text',
            text: message,
            attachedFileUrls: attachments?.map((attachment) => attachment.url),
          }
        : undefined,
    })

    console.log(`[sendMessage] result data:`, data)

    // 전송중 타이머 해제
    clearTimeout(longRequest)

    // 전송중 상태 해제
    setIsSending(false)

    if (error) {
      // 에러 상태 설정
      setHasError(true)
      const errorLogs = [
        {
          description: '메세지 전송 실패',
          details:
            error instanceof HTTPError
              ? {
                  status: error.response.status,
                  body: await error.response.json(),
                }
              : error,
          status: 'error',
        },
      ]

      // 클라이언트 로그 저장
      await saveClientLogsQuery({
        apiHost: props.context.apiHost,
        sessionId: props.initialChatReply.sessionId,
        clientLogs: errorLogs,
      })

      // 새로운 로그를 부모 컴포넌트에 전달
      props.onNewLogs?.(errorLogs)
      return
    }
    // 응답 데이터가 존재하지 않는 경우 처리 종료
    if (!data) return

    // 프로그레스 진행상황 업데이트
    if (data.progress) props.onProgressUpdate?.(data.progress)

    if (data.lastMessageNewFormat) {
      setFormattedMessages([
        ...formattedMessages(),
        {
          inputIndex: [...chatChunks()].length - 1,
          formattedMessage: data.lastMessageNewFormat as string,
        },
      ])
    }

    // 응답에 로그가 포함되어 있으면 이를 부모 컴포넌트에 전달
    if (data.logs) props.onNewLogs?.(data.logs)

    // 동적 테마가 포함되어 있으면 이를 업데이트
    if (data.dynamicTheme) setDynamicTheme(data.dynamicTheme)

    // 새로운 입력 블록이 있으면 onNewInputBlock 콜백을 호출하여 전달
    if (data.input && props.onNewInputBlock) {
      props.onNewInputBlock(data.input)
    }

    // 클라이언트 사이드 액션을 처리
    if (data.clientSideActions) {
      const actionsBeforeFirstBubble = data.clientSideActions.filter((action) =>
        isNotDefined(action.lastBubbleBlockId)
      )
      await processClientSideActions(actionsBeforeFirstBubble)
      if (
        data.clientSideActions.length === 1 &&
        data.clientSideActions[0].type === 'stream' &&
        data.messages.length === 0 &&
        data.input === undefined
      )
        return
    }

    // 기존 chunk에 새로운 메시지와 입력 블록을 포함하는 새로운 chunk를 추가하여 chatChunks 상태를 업데이트
    setChatChunks((displayedChunks) => [
      ...displayedChunks,
      {
        input: data.input,
        messages: data.messages,
        clientSideActions: data.clientSideActions,
      },
    ])
  }

  //사용자가 대화의 마지막 부분에 있을 때만 스크롤을 유지하고 싶을 때 유용합니다. 특정 요소로 스크롤할 수 있다는 점에서 더욱 세밀한 컨트롤이 가능

  const autoScrollToBottom = (lastElement?: HTMLDivElement, offset = 0) => {
    if (!chatContainer) return

    const bottomTolerance =
      chatContainer.clientHeight * autoScrollBottomToleranceScreenPercent -
      bottomSpacerHeight

    const isBottomOfLastElementInView =
      chatContainer.scrollTop + chatContainer.clientHeight >=
      chatContainer.scrollHeight - bottomTolerance

    if (isBottomOfLastElementInView) {
      setTimeout(() => {
        chatContainer?.scrollTo(
          0,
          lastElement
            ? lastElement.offsetTop - offset
            : chatContainer.scrollHeight
        )
      }, 50)
    }
  }
  // ChatChunk 컴포넌트에 전달
  /*
이 함수는 대화의 모든 메시지 버블이 화면에 표시된 후에 호출됩니다. 주로 대화가 종료될 때 추가 작업을 처리하는 역할을 합니다.
예를 들어, 대화가 끝난 후에 특정 UI 상태를 변경하거나 후속 작업(예: 종료 메시지 표시)을 수행할 때 사용할 수 있습니다.
  */
  const handleAllBubblesDisplayed = async () => {
    const lastChunk = [...chatChunks()].pop()
    if (!lastChunk) return

    // 만약 마지막 청크에 입력 블록(input)이 정의되지 않았다면, 이는 대화의 종료를 의미할 수 있습니다. 이 경우, props.onEnd?.() 콜백이 호출되어 대화가 끝났음을 부모 컴포넌트나 상위 로직에 알립니다.
    if (isNotDefined(lastChunk.input)) {
      props.onEnd?.()
    }
  }
  /**
   * 역할:
      새로운 채팅 버블이 표시될 때:
      이 함수는 특정 블록 ID(blockId)에 대응하는 새로운 채팅 버블이 화면에 표시되었을 때 호출됩니다.
      클라이언트 사이드 액션 처리:
      마지막 청크에 정의된 클라이언트 사이드 액션이 있는지 확인합니다.
      만약 클라이언트 사이드 액션이 존재하고, 그 액션의 lastBubbleBlockId가 현재 표시된 버블의 ID와 일치하면, 해당 액션을 processClientSideActions 함수를 통해 실행합니다.
    용도:
      이 함수는 새로운 대화 상자가 화면에 표시될 때마다 특정 클라이언트 사이드 액션을 수행하기 위해 사용됩니다.
      예를 들어, 특정 메시지가 표시될 때 추가적인 스크립트를 실행하거나, 외부 API를 호출하는 등의 작업을 처리할 수 있습니다.
   * 
   */
  const handleNewBubbleDisplayed = async (blockId: string) => {
    const lastChunk = [...chatChunks()].pop()
    if (!lastChunk) return
    if (lastChunk.clientSideActions) {
      const actionsToExecute = lastChunk.clientSideActions.filter(
        (action) => action.lastBubbleBlockId === blockId
      )
      await processClientSideActions(actionsToExecute)
    }
  }

  const processClientSideActions = async (
    actions: NonNullable<ContinueChatResponse['clientSideActions']>
  ) => {
    if (isRecovered()) return
    for (const action of actions) {
      if (
        'streamOpenAiChatCompletion' in action ||
        'webhookToExecute' in action ||
        'stream' in action
      )
        setIsSending(true)

      // 클라이언트 사이드 액션 실행
      const response = await executeClientSideAction({
        clientSideAction: action,
        context: {
          apiHost: props.context.apiHost,
          sessionId: props.initialChatReply.sessionId,
        },
        onMessageStream: streamMessage,
      })
      if (response && 'logs' in response) saveLogs(response.logs)

      // response가 존재하고 'replyToSend'가 존재하는 경우
      // '보내는 상태'를 해제
      // sendMessage 함수를 호출하여 응답을 전송
      if (response && 'replyToSend' in response) {
        setIsSending(false)
        sendMessage(response.replyToSend)
        return
      }
      if (response && 'blockedPopupUrl' in response)
        setBlockedPopupUrl(response.blockedPopupUrl)
    }
  }

  onCleanup(() => {
    console.log(`[ConversationContainer] onCleanup`, connectChatServer())
    setStreamingMessage(undefined)
    setFormattedMessages([])

    connectChatServer()?.closeSocket()

    setConnectChatServer(undefined)

    setIsInputActive(false)

    // if (connectChatServer()) {
    //   connectChatServer()!.closeSocket()
    // }
    const textArea = inputRef as unknown as HTMLTextAreaElement
    if (textArea) {
      textArea.removeEventListener('keydown', handleKeyDown)
    }
  })

  const handleSkip = () => sendMessage(undefined)

  // 상담시스템으로 이미지 정보 보냄
  const sendFileUserMessage = (message: ContinueChatResponse) => {
    message.messages.forEach((msg) => {
      if (msg.type !== BubbleBlockType.IMAGE) return
      if (!msg.content.url) return

      const message = {
        text: '',
        sender: connectChatServer()?.customData.member.userKey ?? '',
        memberId: connectChatServer()?.customData.member.memberId ?? '',
        channelId:
          sessionRequestChatServerSignal() ??
          connectChatServer()?.customData.member.sessionId,
        clientId: props.context.typebot.id,
        sendAt: new Date().getTime().toString(),
        files: [
          {
            contentType: 'image/jpeg',
            name: msg.content.url.substring(
              msg.content.url.lastIndexOf('/') + 1
            ),
            type: 'image',
            fileUrl: msg.content.url,
          },
        ],
      }

      connectChatServer()?.sendUserFileMessage(message)
    })
  }

  return (
    <div
      ref={chatContainer}
      class="flex flex-col overflow-y-auto w-full px-3 pt-10 relative scrollable-container typebot-chat-view scroll-smooth gap-2"
    >
      <Show when={isCenterInfoVisible()}>
        <div>
          <header>
            <div>센터 정보(임시)</div>
          </header>
        </div>
      </Show>

      <For each={chatChunks()}>
        {(chatChunk, index) => (
          console.log(`chatChunk index:${index()}`, chatChunk),
          (
            // chunk는 입력을 기준으로 잘라짐
            <ChatChunk
              // index: 이 청크가 chatChunks 배열 내에서 몇 번째 항목인지를 나타내는 인덱스입니다. 이를 통해 각 청크의 순서를 유지하고, 필요한 경우 특정 청크에 대해 추가적인 처리를 할 수 있습니다.
              index={index()}
              // messages: 이 청크에 포함된 메시지들을 배열 형태로 전달합니다. 각각의 메시지는 텍스트, 이미지, 파일 등의 다양한 형식을 가질 수 있으며, ChatChunk 컴포넌트는 이 메시지들을 적절하게 렌더링합니다.
              messages={chatChunk.messages}
              // input: 이 청크와 연결된 입력 블록을 전달합니다. 입력 블록은 사용자가 현재 또는 이전에 입력한 텍스트, 파일, 옵션 등을 포함하며, 이를 통해 ChatChunk가 대화의 맥락을 유지할 수 있습니다.
              input={chatChunk.input}
              // theme: 현재 대화에 적용된 테마 정보를 전달합니다. 이 테마는 메시지 버블의 색상, 폰트, 기타 스타일 요소를 정의하며, 사용자 인터페이스의 일관성을 유지합니다.
              theme={theme()}
              // settings: 대화 설정을 전달합니다. 예를 들어, 대화의 언어, 메시지 표시 방법, 기타 사용자 정의 설정 등을 포함할 수 있으며, 이는 ChatChunk가 대화의 룩앤필을 적절히 구성하는 데 사용됩니다.
              settings={props.initialChatReply.typebot.settings}
              // streamingMessageId: 현재 청크가 스트리밍 메시지와 연결되어 있는지 확인하기 위해 사용됩니다. 스트리밍 메시지의 경우, 메시지가 점진적으로 추가되므로 이 ID를 통해 계속해서 업데이트할 수 있습니다.
              streamingMessageId={chatChunk.streamingMessageId}
              // context: 대화의 전체적인 맥락 정보를 전달합니다. 예를 들어, 현재 사용자의 정보, 봇의 설정, API 호스트 등의 정보가 포함되어 있으며, 이는 ChatChunk가 대화의 흐름을 적절히 유지하는 데 도움이 됩니다.
              context={props.context}
              // hideAvatar: 청크에서 아바타를 숨길지 여부를 결정합니다. 일반적으로 같은 사용자가 연속해서 메시지를 보낼 때는 첫 메시지 이후 아바타를 숨기게 되는데, 이 조건은 아바타를 숨겨야 하는지 판단합니다.
              hideAvatar={
                !chatChunk.input &&
                ((chatChunks()[index() + 1]?.messages ?? 0).length > 0 ||
                  chatChunks()[index() + 1]?.streamingMessageId !== undefined ||
                  (chatChunk.messages.length > 0 && isSending()))
              }
              // hasError: 마지막 청크에서 에러가 발생했는지 여부를 나타냅니다. 에러가 발생하면, 이를 표시하여 사용자에게 알려줄 수 있습니다. 예를 들어, 메시지 전송 실패 시 해당 청크에 에러 상태를 표시할 수 있습니다.
              hasError={hasError() && index() === chatChunks().length - 1}
              // isTransitionDisabled: 이 청크가 현재 대화에서 마지막이 아닌 경우, 트랜지션(애니메이션 등)을 비활성화합니다. 이는 이전 청크들이 대화의 흐름에서 자연스럽게 고정되도록 하고, 새로운 메시지에만 트랜지션을 적용하기 위함입니다.
              isTransitionDisabled={index() !== chatChunks().length - 1}
              // onNewBubbleDisplayed: 새로운 버블이 표시될 때 호출되는 콜백입니다. 예를 들어, 사용자가 메시지를 읽거나 새로운 메시지가 표시될 때 특정 작업을 수행할 수 있습니다.
              onNewBubbleDisplayed={handleNewBubbleDisplayed}
              // onAllBubblesDisplayed: 대화의 모든 버블이 화면에 표시된 후 호출되는 콜백입니다. 이 콜백은 대화가 끝났을 때 후속 작업을 처리하거나, 스크롤을 조정하는 등의 작업에 유용할 수 있습니다.
              onAllBubblesDisplayed={handleAllBubblesDisplayed}
              // onSubmit: 사용자가 입력한 메시지를 전송할 때 호출되는 함수입니다. 이 함수는 사용자가 입력한 텍스트나 파일을 서버로 전송하거나, 대화의 다음 단계로 넘어가는 작업을 처리합니다.
              onSubmit={sendMessage}
              // onScrollToBottom: 대화 창을 자동으로 스크롤하여 마지막 메시지가 항상 화면에 표시되도록 하는 함수입니다. 이를 통해 사용자가 항상 최신 메시지를 볼 수 있도록 보장합니다.
              onScrollToBottom={autoScrollToBottom}
              // onSkip: 현재 입력 블록을 건너뛰고 다음으로 넘어갈 때 호출되는 함수입니다. 이 함수는 사용자가 특정 입력을 건너뛰고 싶은 경우나, 자동으로 다음 단계로 넘어가야 할 때 유용합니다.
              onSkip={handleSkip}
            />
          )
        )}
      </For>
      <Show when={isSending()}>
        <LoadingChunk theme={theme()} />
      </Show>
      <Show when={blockedPopupUrl()} keyed>
        {(blockedPopupUrl) => (
          <div class="flex justify-end">
            <PopupBlockedToast
              url={blockedPopupUrl}
              onLinkClick={() => setBlockedPopupUrl(undefined)}
            />
          </div>
        )}
      </Show>
      <BottomSpacer />
    </div>
  )
}

const BottomSpacer = () => (
  <div
    class="w-full flex-shrink-0 typebot-bottom-spacer"
    style={{ height: bottomSpacerHeight + 'px' }}
  />
)
