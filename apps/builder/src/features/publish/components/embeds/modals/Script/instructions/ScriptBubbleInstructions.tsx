import { CodeEditor } from '@/components/inputs/CodeEditor'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { Stack, Text } from '@chakra-ui/react'
import { BubbleProps } from '@typebot.io/nextjs'
import { useState } from 'react'
import { BubbleSettings } from '../../../settings/BubbleSettings/BubbleSettings'
import {
  parseInlineScript,
  parseInitBubbleCode,
  typebotImportCode,
  parseApiHostValue,
} from '../../../snippetParsers'
import { parseDefaultBubbleTheme } from '../../Javascript/instructions/JavascriptBubbleInstructions'

export const ScriptBubbleInstructions = () => {
  const { typebot } = useTypebot()
  const [theme, setTheme] = useState<BubbleProps['theme']>(
    parseDefaultBubbleTheme(typebot)
  )
  const [previewMessage, setPreviewMessage] =
    useState<BubbleProps['previewMessage']>()

  const scriptSnippet = parseInlineScript(
    `${typebotImportCode}

${parseInitBubbleCode({
  typebot: typebot?.publicId ?? '',
  apiHost: parseApiHostValue(typebot?.customDomain),
  theme,
  previewMessage,
})}`
  )

  return (
    <Stack spacing={4}>
      <BubbleSettings
        theme={theme}
        previewMessage={previewMessage}
        defaultPreviewMessageAvatar={typebot?.theme.chat?.hostAvatar?.url ?? ''}
        onThemeChange={setTheme}
        onPreviewMessageChange={setPreviewMessage}
      />
      <Text>라잇봇 초기화를 위해 아래 코드를 추가하세요:</Text>
      <CodeEditor isReadOnly value={scriptSnippet} lang="javascript" />
    </Stack>
  )
}
