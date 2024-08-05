import { defaultButtonLabel } from '../constants'
import { EmailInputBlock } from './schema'

export const defaultEmailInputOptions = {
  labels: {
    button: defaultButtonLabel,
    placeholder: '이메일 주소를 입력하세요...',
  },
  retryMessageContent:
    '유효하지 않은 이메일 주소입니다. 다시 입력하시겠습니까?',
} as const satisfies EmailInputBlock['options']
