import { appRouter } from '@/helpers/server/appRouter'
import * as Sentry from '@sentry/nextjs'
import { createOpenApiNextHandler } from '@lilyrose2798/trpc-openapi'
import cors from 'nextjs-cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { createContext } from '@/helpers/server/context'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // await cors(req, res, {
  //   origin: '*',
  //   methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  //   optionsSuccessStatus: 200,
  // })

  await cors(req, res)

  res.setHeader('Access-Control-Allow-Origin', '*')
  // console.log(`API ${req.method} ${req.url}`)
  return createOpenApiNextHandler({
    router: appRouter,
    createContext,
    onError({ error }) {
      console.error('Something went wrong', error)
      if (error.code === 'INTERNAL_SERVER_ERROR') {
        Sentry.captureException(error)
        console.error('Something went wrong', error)
      }
    },
  })(req, res)
}

export default handler
