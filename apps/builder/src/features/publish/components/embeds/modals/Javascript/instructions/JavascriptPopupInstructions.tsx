import { Stack, Code, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { PopupSettings } from '../../../settings/PopupSettings'
import { JavascriptPopupSnippet } from '../JavascriptPopupSnippet'

export const JavascriptPopupInstructions = () => {
  const [inputValue, setInputValue] = useState<number>()

  return (
    <Stack spacing={4}>
      <PopupSettings
        onUpdateSettings={(settings) => setInputValue(settings.autoShowDelay)}
      />
      <Text>
        HTML 코드 내 <Code>{'<body>'}</Code>에 붙여넣으세요:
      </Text>
      <JavascriptPopupSnippet autoShowDelay={inputValue} />
    </Stack>
  )
}
