import { createSignal } from 'solid-js'

export const [
  sessionRequestChatServerSignal,
  setSessionRequestChatServerSignal,
] = createSignal<string>('')
