import { defaultButtonLabel } from '../constants'
import { PhoneNumberInputBlock } from './schema'

export const defaultPhoneInputOptions = {
  labels: {
    button: defaultButtonLabel,
    placeholder: '전화번호를 입력해주세요.',
  },
  retryMessageContent:
    '전화번호 형식이 유효하지 않습니다. 다시 입력하시겠습니까?',
} as const satisfies PhoneNumberInputBlock['options']
