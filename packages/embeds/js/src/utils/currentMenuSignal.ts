import { MenuType } from '../types'
import { createSignal } from 'solid-js'

// 현재 메뉴 정보
export const [currentMenuType, setCurrentMenuType] = createSignal<MenuType>(
  MenuType.CONVERSATION
)
