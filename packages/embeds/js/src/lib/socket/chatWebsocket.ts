import { CustomData, WsPayloadType } from '../../types'
import { setEventChatServerSignal } from '../../utils/eventChatServerSignal'
import { sessionRequestChatServerSignal } from '../../utils/sessionRequestChatServerSignal'

export class SocketContainer {
  url: string

  restApiUrl: string

  path: string

  customData: CustomData

  websocket: ChatWebsocket | null

  constructor(
    url: string,
    path: string,
    restApiUrl: string,
    customData: CustomData
  ) {
    this.url = url
    this.path = path
    this.restApiUrl = restApiUrl
    this.customData = customData
    this.websocket = null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendSocket(request_type: string, data: { [key: string]: any }) {
    if (this.websocket && this.isInitialized()) {
      data.type = request_type

      console.log(
        `[SocketContainer] sendSocket request_type: ${request_type} data:`,
        data
      )

      this.websocket.send(
        JSON.stringify({
          action: request_type,
          data,
        })
      )
    } else {
      console.error(`[SocketContainer] sendSocket socket is not initialized`)
    }
  }

  sendSessionRequest(userData: CustomData) {
    try {
      this.sendSocket(WsPayloadType.SESSION_REQUEST, userData.member)
    } catch (error) {
      console.error(`[ChatWebsocket] sendSessionRequest error:`, error)
    }
  }

  sendUserFileMessage(message: { [key: string]: string | object }) {
    try {
      this.sendSocket(WsPayloadType.USER_FILE_MESSAGE, message)
    } catch (error) {
      console.error(`[ChatWebsocket] sendUserFileMessage error:`, error)
    }
  }

  sendUserMessage(message: { [key: string]: string }) {
    try {
      this.sendSocket(WsPayloadType.USER_MESSAGE, message)
    } catch (error) {
      console.error(`[ChatWebsocket] sendUserMessage error:`, error)
    }
  }

  sendUserAgentOpenAction() {
    try {
      this.sendSocket(WsPayloadType.USER_BOT_RESPONSE, {
        actionPayload: {
          type: 'ACTION',
          text: '상담연결 open',
          payload: 'AGENT',
        },
        channelId: sessionRequestChatServerSignal(),
        sendAt: new Date().getTime().toString(),
      })
    } catch (error) {
      console.error(`[ChatWebsocket] sendUserAction error:`, error)
    }
  }

  createSocket() {
    this.websocket = createCustomSocket(
      this.url,
      this.customData,
      this,
      this.path
    )
  }

  createSocketWithParams(
    url: string,
    path: string,
    customData: CustomData,
    container: SocketContainer
  ) {
    this.websocket = createCustomSocket(url, customData, container, path)
  }

  isInitialized() {
    return (
      this.websocket !== null &&
      this.websocket.readyState === this.websocket.OPEN
    )
  }

  closeSocket() {
    if (this.websocket) {
      console.log(`[SocketContainer] closeSocket`)
      this.websocket.close()
    }
  }
}

export class ChatWebsocket extends WebSocket {
  container: SocketContainer
  socketUrl!: string
  customData!: CustomData
  path: string | undefined

  constructor(
    url: string,
    path: string,
    container: SocketContainer,
    customData: CustomData
  ) {
    super(url, [])

    this.container = container

    this.customData = customData

    this.path = path
  }
}

export default function createCustomSocket(
  socketUrl: string,
  customData: CustomData,

  container: SocketContainer,
  path: string
): ChatWebsocket {
  // const options: { path?: string } = path ? { path } : {};

  // console.log(`CustomSocket customData:`, customData);
  const queryParams = Object.entries(customData.member)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&')

  const urlWithQueryParams = queryParams
    ? `${socketUrl}?${queryParams}`
    : socketUrl

  console.log(
    `[CustomSocket createCustomSocket] urlWithQueryParams: ${urlWithQueryParams}`
  )
  const socket = new ChatWebsocket(
    urlWithQueryParams,
    path,
    container,
    customData
  )

  socket.addEventListener('open', function (event) {
    console.log(`[WS-open]socket open event:`, event)

    // if (socket.container) {
    //   socket.container.emit('connect', event)
    // }

    setEventChatServerSignal({
      action: WsPayloadType.CONNECT,
      event,
    })
  })

  socket.addEventListener('message', handleMessageEvent)

  function handleMessageEvent(event: MessageEvent): void {
    // console.log('[WS-message]Message from server event:', event)

    try {
      if (!socket.container) return
      if (!event.data) return

      const parseEvent = JSON.parse(event.data)
      // console.log(
      //   `[WS-message] socket parseEvent action: ${parseEvent.action}`,
      //   socket.container
      // )

      handleEvent(parseEvent.action, parseEvent)
    } catch (error) {
      console.error(`[WS-message] socket message event error`, error)
    }
  }

  function handleEvent(action: string, parseEvent: Partial<unknown>) {
    switch (action) {
      case 'session_confirm':
        emitEvent(action, parseEvent)
        // console.log(`[WS-message] session confirm event emit`)
        break
      case 'session_terminate':
        emitEvent(action, parseEvent)
        // console.log(`[WS-message] session terminate event emit`)
        break
      case 'agent_response':
        emitEvent(action, parseEvent)
        // console.log(`[WS-message] agent response event emit`)
        break
      case 'agent_start_response':
        emitEvent(action, parseEvent)
        // console.log(`[WS-message] agent start response event emit`)
        break
      case 'status_change_event':
        emitEvent(action, parseEvent)
        console.log(`[WS-message] status change event emit`)
        break
      case 'bot_welcome_response':
        emitEvent(action, parseEvent)
        // console.log(`[WS-message] bot welcome response event emit`)
        break
      case 'bot_welcome_response_complete':
        emitEvent(action, parseEvent)
        // console.log(`[WS-message] bot welcome response complete event emit`)
        break
      case 'bot_message_response':
        emitEvent(action, parseEvent)
        // console.log(`[WS-message] bot response by user action event emit`)
        break
      case 'user_message':
        emitEvent(action, parseEvent)
        // console.log(`[WS-message] user message event emit`)
        break

      default:
        console.log('[WS-message] not handle event', parseEvent)
        break
    }
  }

  function emitEvent(action: string, parseEvent: unknown) {
    // if (socket.container) {
    //   socket.container.emit(action, parseEvent)
    // }
    setEventChatServerSignal(parseEvent as Event)
  }

  socket.addEventListener('error', function (event) {
    console.error(`[WS-error]socket error`, event)

    setEventChatServerSignal(event as Event)
  })

  socket.addEventListener('close', function (event) {
    console.log('[WS-close] socket close', event)

    // if (socket.container) {
    //   socket.container.emit('disconnect', {})
    // }

    setEventChatServerSignal(event as Event)
  })

  return socket
}
