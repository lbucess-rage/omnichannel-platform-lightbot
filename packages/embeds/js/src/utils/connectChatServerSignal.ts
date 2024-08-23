import { SocketContainer } from '../lib/socket/chatWebsocket'

import { Setter } from 'solid-js'

import { Accessor, createSignal } from 'solid-js'

interface SocketContainerState {
  connectChatServer: Accessor<SocketContainer | undefined>
  setConnectChatServer: Setter<SocketContainer | undefined>
}

type socketContainerOption = {
  centerId?: string
  layout?: string
  userKey: string
  memberId: string
  userName: string
  sessionId: string
  socketUrl: string
  restApiUrl: string
}

declare global {
  interface Window {
    socketContainerState?: SocketContainerState

    initSocketContainer?: (options: socketContainerOption) => void

    resetSocketContainerState?: () => void
  }
}

export const [connectChatServer, setConnectChatServer] = createSignal<
  SocketContainer | undefined
>(undefined)

console.log(`createSignal<SocketContainer>()`, connectChatServer())
window.socketContainerState = {
  connectChatServer,
  setConnectChatServer,
}
if (!window.initSocketContainer) {
  window.initSocketContainer = (options: socketContainerOption) => {
    const { socketUrl, restApiUrl, ...rest } = options

    const socketContainer = new SocketContainer(socketUrl, '/', restApiUrl, {
      member: { ...rest },
    })

    if (
      window.socketContainerState &&
      typeof window.socketContainerState.setConnectChatServer === 'function'
    ) {
      if (!socketContainer.isInitialized()) {
        console.log(`socketContainer.createSocket()`)
        socketContainer.createSocket()
      }

      window.socketContainerState.setConnectChatServer(socketContainer)
      return
    }
  }
}
