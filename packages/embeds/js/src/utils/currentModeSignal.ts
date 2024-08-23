import { ModeType } from '../types'
import { createSignal } from 'solid-js'

export const [currentMode, setCurrentMode] = createSignal<ModeType>(
  ModeType.SESSION
)
