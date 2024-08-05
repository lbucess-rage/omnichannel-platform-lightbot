import { defaultButtonLabel } from '../constants'
import { TextInputBlock } from './schema'

export const defaultTextInputOptions = {
  isLong: false,
  labels: { button: defaultButtonLabel, placeholder: '메세지를 입력하세요' },
  attachments: {
    isEnabled: false,
    visibility: 'Auto',
  },
} as const satisfies TextInputBlock['options']
