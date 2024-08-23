import { createSignal } from 'solid-js'
import { Message, ResponseMessage } from '../types'

type SocketEvent = {
  action: string
  event: Event | MessageEvent
}
console.log(`createSignal eventChatServerSignal`)
export const [eventChatServerSignal, setEventChatServerSignal] = createSignal<
  ResponseMessage | Message | Event | MessageEvent | SocketEvent
>()

export const [eventsChatServerSignal, setEventsChatServerSignal] = createSignal<
  ResponseMessage[]
>([])
