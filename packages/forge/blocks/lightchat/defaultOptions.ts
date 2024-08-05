import { option } from '@typebot.io/forge'
import { defaultLightchatOptions } from './constants'

export const defaultOptions = option
  .object({
    socketUrl: option.string.layout({
      accordion: 'Select Omnichannel Chat server',
      label: 'WebSocket URL',
      defaultValue: defaultLightchatOptions.socketUrl,
    }),
    restApiUrl: option.string.layout({
      accordion: 'Select Omnichannel API server',
      label: 'REST API URL',
      defaultValue: defaultLightchatOptions.restApiUrl,
    }),
  })
  .describe('채팅 상담 서버 연결을 위한 설정입니다.')
