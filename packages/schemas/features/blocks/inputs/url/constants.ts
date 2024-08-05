import { defaultButtonLabel } from '../constants'
import { UrlInputBlock } from './schema'

export const defaultUrlInputOptions = {
  labels: {
    button: defaultButtonLabel,
    placeholder: 'URL을 입력해주세요...',
  },
  retryMessageContent:
    '유효하지 않은 URL 주소형식 입니다. 다시 입력하시겠습니까?',
} as const satisfies UrlInputBlock['options']
