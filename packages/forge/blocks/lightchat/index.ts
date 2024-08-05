import { createBlock } from '@typebot.io/forge'
import { LightchatLogo } from './logo'
import { DarkLogo } from './dark-logo'
import { defaultOptions } from './defaultOptions'
import { connectChat } from './actions/connectChat'

export const lightchatBlock = createBlock({
  id: 'lightchat',
  name: 'lightChat',
  fullName: 'omnichannel-platform과 연동되는 채팅상담 시작 블록',
  tags: ['chat', 'lightchat'],
  DarkLogo: DarkLogo,
  LightLogo: LightchatLogo,
  actions: [
    connectChat,
    // disconnectChat,
  ],
  options: defaultOptions,
})
