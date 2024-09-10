import { isNotDefined, isNotEmpty } from '../../../../lib'
import ky from 'ky'
import { guessApiHost } from '@/utils/guessApiHost'
import {
  ResultWithAnswers,
  ResultWithAnswersChatSessions,
} from '../../../../schemas'

type Props = {
  memberId: string
  userKey?: string
  prefilledVariables?: Record<string, unknown>
  apiHost?: string
  limit?: number
}

export async function getResultsQueryByMemberId({
  memberId,
  apiHost,
  limit,
}: Props) {
  if (isNotDefined(memberId)) {
    throw new Error('Member ID is required to get results')
  }
  isNotDefined(limit) && (limit = 10)
  try {
    const data = await ky
      .get(
        `${
          isNotEmpty(apiHost) ? apiHost : guessApiHost()
        }/api/chatSessions/${memberId}/results?limit=${limit}`
        // {
        //   timeout: false,
        // }
      )
      .json<{ results: ResultWithAnswersChatSessions[] }>()

    console.log('getResultsQueryByMemberId result', data)

    return { data }
    // if (data) {
    //   return { data }
    // } else {
    //   ;[]
    // }
    // return {
    //   data: {
    //     ...data,
    //   } satisfies { results: ResultWithAnswers[] },
    // }
  } catch (error) {
    console.error(error)
    return { error }
  }
}
