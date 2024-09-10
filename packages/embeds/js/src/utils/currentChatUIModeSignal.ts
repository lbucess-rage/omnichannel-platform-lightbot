import { createSignal } from 'solid-js'
import { ChatUIModeType } from '../types'

export const [currentChatUIModeType, setCurrentChatUIModeType] =
  createSignal<ChatUIModeType>(ChatUIModeType.INIT)
