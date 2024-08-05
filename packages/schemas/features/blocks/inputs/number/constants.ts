import { defaultButtonLabel } from '../constants'
import { NumberInputBlock } from './schema'

export const defaultNumberInputOptions = {
  labels: { button: defaultButtonLabel, placeholder: '숫자를 입력하세요...' },
} as const satisfies NumberInputBlock['options']
