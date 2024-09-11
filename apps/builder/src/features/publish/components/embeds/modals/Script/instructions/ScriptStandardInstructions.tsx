import { CodeEditor } from '@/components/inputs/CodeEditor'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { Stack, Code, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { StandardSettings } from '../../../settings/StandardSettings'
import { parseInitStandardCode } from '../../../snippetParsers/standard'
import { parseStandardElementCode } from '../../Javascript/JavascriptStandardSnippet'
import {
  parseApiHostValue,
  parseInlineScript,
  typebotImportCode,
} from '../../../snippetParsers/shared'

export const ScriptStandardInstructions = () => {
  const { typebot } = useTypebot()
  const [inputValues, setInputValues] = useState<{
    heightLabel: string
    widthLabel?: string
  }>({
    heightLabel: '100%',
    widthLabel: '100%',
  })

  const standardElementSnippet = parseStandardElementCode(
    inputValues.widthLabel,
    inputValues.heightLabel
  )

  const scriptSnippet = parseInlineScript(`${typebotImportCode}
  
${parseInitStandardCode({
  typebot: typebot?.publicId ?? '',
  apiHost: parseApiHostValue(typebot?.customDomain),
})}`)

  return (
    <Stack spacing={4}>
      <StandardSettings
        onUpdateWindowSettings={(settings) => setInputValues({ ...settings })}
      />
      <Text>
        <Code>typebot-standard</Code> 스크립트를 HTML 코드 내{' '}
        <Code>{'<body>'}</Code> 추가하세요:
      </Text>
      <CodeEditor isReadOnly value={standardElementSnippet} lang="html" />
      <Text>라잇봇 초기화를 위해 아래 코드를 추가하세요:</Text>
      <CodeEditor isReadOnly value={scriptSnippet} lang="javascript" />
    </Stack>
  )
}
