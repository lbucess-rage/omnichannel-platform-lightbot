import { Stack, Code, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { StandardSettings } from '../../../settings/StandardSettings'
import { JavascriptStandardSnippet } from '../JavascriptStandardSnippet'

export const JavascriptStandardInstructions = () => {
  const [inputValues, setInputValues] = useState<{
    heightLabel: string
    widthLabel?: string
  }>({
    heightLabel: '100%',
    widthLabel: '100%',
  })

  return (
    <Stack spacing={4}>
      <StandardSettings
        onUpdateWindowSettings={(settings) => setInputValues({ ...settings })}
      />
      <Text>
        HTML 코드 내 <Code>{'<body>'}</Code>에 붙여넣으세요:
      </Text>
      <JavascriptStandardSnippet {...inputValues} />
    </Stack>
  )
}
