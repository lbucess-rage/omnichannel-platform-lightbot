import { CodeEditor } from '@/components/inputs/CodeEditor'
import { TextLink } from '@/components/TextLink'
import { useEditor } from '@/features/editor/providers/EditorProvider'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { parseApiHost } from '@/features/publish/components/embeds/snippetParsers'
import {
  Code,
  ListItem,
  OrderedList,
  Stack,
  StackProps,
  Text,
} from '@chakra-ui/react'

export const ApiPreviewInstructions = (props: StackProps) => {
  const { typebot } = useTypebot()
  const { startPreviewAtGroup } = useEditor()

  const startParamsBody = startPreviewAtGroup
    ? `{
    "startGroupId": "${startPreviewAtGroup}"
}`
    : undefined

  const replyBody = `{
  "message": "응답 메세지를 입력하세요"
}`

  return (
    <Stack spacing={10} overflowY="auto" w="full" {...props}>
      <OrderedList spacing={6} px="1">
        <ListItem>
          All your requests need to be authenticated with an API token.{' '}
          <TextLink href="https://docs.typebot.io/api-reference/authentication">
            See instructions
          </TextLink>
          .
        </ListItem>
        <ListItem>
          <Stack>
            <Text>
              채팅을 시작할 때 아래 <Code>POST</Code> 요청을 보내세요
            </Text>
            <CodeEditor
              isReadOnly
              lang={'shell'}
              value={`${parseApiHost(typebot?.customDomain)}/api/v1/typebots/${
                typebot?.id
              }/preview/startChat`}
            />
            {startPreviewAtGroup && (
              <>
                <Text>JSON body:</Text>
                <CodeEditor isReadOnly lang={'json'} value={startParamsBody} />
              </>
            )}
          </Stack>
        </ListItem>
        <ListItem>
          처음 응답에는 이후 요청에 필요한 <Code>sessionId</Code>가 포함됩니다.
        </ListItem>
        <ListItem>
          <Stack>
            <Text>
              답변을 보내려면 다음 <Code>POST</Code> 요청을 보내세요
            </Text>
            <CodeEditor
              isReadOnly
              lang={'shell'}
              value={`${parseApiHost(
                typebot?.customDomain
              )}/api/v1/sessions/<ID_FROM_FIRST_RESPONSE>/continueChat`}
            />
            <Text>JSON body:</Text>
            <CodeEditor isReadOnly lang={'json'} value={replyBody} />
            <Text>
              <Code>{'<ID_FROM_FIRST_RESPONSE>'}</Code> 부분을 with{' '}
              <Code>sessionId</Code> 로 변경하세요.
            </Text>
          </Stack>
        </ListItem>
      </OrderedList>
      {/* <Text fontSize="sm" pl="1">
        Check out the{' '}
        <TextLink
          href="https://docs.typebot.io/api-reference/chat/start-preview-chat"
          isExternal
        >
          API reference
        </TextLink>{' '}
        for more information
      </Text> */}
    </Stack>
  )
}
