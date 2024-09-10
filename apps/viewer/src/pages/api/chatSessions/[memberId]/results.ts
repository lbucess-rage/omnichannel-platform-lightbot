import prisma from '@typebot.io/lib/prisma'
import { ResultWithAnswersChatSessions } from '@typebot.io/schemas'
import { NextApiRequest, NextApiResponse } from 'next'
import { methodNotAllowed } from '@typebot.io/lib/api'
import cors from 'nextjs-cors'
import { ChatSession } from '@typebot.io/prisma'

// 한 달 전 날짜 계산
const getOneMonthAgo = () => {
  const today = new Date()
  const oneMonthAgo = new Date(today)
  oneMonthAgo.setMonth(today.getMonth() - 1) // 현재 달에서 1달을 뺍니다
  return oneMonthAgo
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(`results.ts handler`)
  // const user = await authenticateUser(req)
  // if (!user) return res.status(401).json({ message: 'Not authenticated' })
  // res.setHeader('Access-Control-Allow-Origin', '*')
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')

  await cors(req, res)

  if (req.method === 'GET') {
    const memberId = req.query.memberId as string

    const limit = Number(req.query.limit)
    const oneMonthAgo = getOneMonthAgo()

    console.log(
      `memberId: ${memberId}, limit: ${limit}, oneMonthAgo: ${oneMonthAgo}`
    )
    const results = (await prisma.result.findMany({
      where: {
        AND: [
          {
            createdAt: { gte: oneMonthAgo },
          },

          {
            variables: {
              array_contains: [
                {
                  name: 'memberId',
                  value: memberId.toString(),
                },
              ],
            },
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { answers: true, typebot: true },
    })) as unknown as ResultWithAnswersChatSessions[]

    // 각 result의 lastChatSessionId로 ChatSession 데이터를 조회하여 추가
    for (const result of results) {
      if (result.lastChatSessionId) {
        const chatSession = await prisma.chatSession.findUnique({
          where: {
            id: result.lastChatSessionId,
          },
        })
        // 결과에 chatSession을 추가
        if (chatSession) {
          result.chatSession = chatSession
        }
      }
    }

    return res.send({ results })
  }

  methodNotAllowed(res)
}

export default handler
