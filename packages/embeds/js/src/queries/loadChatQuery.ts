import { BotContext } from '@/types'
import {
  StartFrom,
  ContinueChatResponse,
  StartChatResponse,
} from '@typebot.io/schemas'
import { isNotDefined } from '../../../../lib'
import ky from 'ky'
import { guessApiHost } from '@/utils/guessApiHost'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lightbot: string | any
  stripeRedirectStatus?: string
  apiHost?: string
  startFrom?: StartFrom
  isPreview: boolean
  prefilledVariables?: Record<string, unknown>
  resultId: string // 필수
  sessionId: string // 필수
}

type LoadState = {
  sessionId: string
  typebot: BotContext['typebot']
  resultId: string
}

export async function loadChatQuery({
  lightbot,
  isPreview,
  apiHost,
  prefilledVariables,
  resultId,
  stripeRedirectStatus,
  startFrom,
  sessionId,
}: Props) {
  if (isNotDefined(lightbot))
    throw new Error('Lightbot ID is required to get initial messages')

  const loadState: LoadState = {
    sessionId: sessionId,
    typebot: lightbot,
    resultId: resultId,
  }

  try {
    const data = await ky
      .post(
        `${apiHost ?? guessApiHost()}/api/v1/sessions/${
          loadState.sessionId
        }/continueChat`,
        {
          json: {
            message: `[action]-loadChat`,
          },
          timeout: false,
        }
      )
      .json<ContinueChatResponse>()

    return {
      data: {
        ...data,
        ...loadState,
      } satisfies StartChatResponse,
    }
  } catch (error) {
    return { error }
  }
}
