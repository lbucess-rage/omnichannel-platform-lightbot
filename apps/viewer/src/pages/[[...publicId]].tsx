import { IncomingMessage } from 'http'
import { ErrorPage } from '@/components/ErrorPage'
import { NotFoundPage } from '@/components/NotFoundPage'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { isNotDefined } from '@typebot.io/lib'
import { TypebotPageProps, TypebotPageV2 } from '@/components/TypebotPageV2'
import { TypebotPageV3, TypebotV3PageProps } from '@/components/TypebotPageV3'
import { env } from '@typebot.io/env'
import prisma from '@typebot.io/lib/prisma'
import { defaultSettings } from '@typebot.io/schemas/features/typebot/settings/constants'
import {
  defaultBackgroundColor,
  defaultBackgroundType,
} from '@typebot.io/schemas/features/typebot/theme/constants'

// Browsers that doesn't support ES modules and/or web components
const incompatibleBrowsers = [
  {
    name: 'UC Browser',
    regex: /ucbrowser/i,
  },
  {
    name: 'Internet Explorer',
    regex: /msie|trident/i,
  },
  {
    name: 'Opera Mini',
    regex: /opera mini/i,
  },
]

const log = (message: string) => {
  if (!env.DEBUG) return
  console.log(`[DEBUG] ${message}`)
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const incompatibleBrowser =
    incompatibleBrowsers.find((browser) =>
      browser.regex.test(context.req.headers['user-agent'] ?? '')
    )?.name ?? null
  const pathname = context.resolvedUrl.split('?')[0]
  const { host, forwardedHost } = getHost(context.req)
  log(`context: ${JSON.stringify(context.req.headers)}`)
  log(`host: ${host}`)
  log(`forwardedHost: ${forwardedHost}`)
  log(`context.query.publicId: ${context.query.publicId}`)
  const protocol =
    context.req.headers['x-forwarded-proto'] === 'https' ||
    (context.req.socket as unknown as { encrypted: boolean }).encrypted
      ? 'https'
      : 'http'

  log(`Request protocol: ${protocol}`)
  try {
    if (!host) return { props: {} }
    const viewerUrls = env.NEXT_PUBLIC_VIEWER_URL
    log(`viewerUrls: ${viewerUrls}`)
    const isMatchingViewerUrlDiff = env.NEXT_PUBLIC_E2E_TEST
      ? true
      : viewerUrls.some(
          (url) =>
            host.split(':')[0].includes(url.split('//')[1].split(':')[0]) ||
            (forwardedHost &&
              forwardedHost
                .split(':')[0]
                .includes(url.split('//')[1].split(':')[0]))

          // (url) => {
          //   const domain = url.split('//')[1].split(':')[0] // https:// 제거 후 도메인만 가져오기
          //   return (
          //     host.split(':')[0].includes(domain) ||
          //     (forwardedHost && forwardedHost.split(':')[0].includes(domain))
          //   )
          // }

          // (url) => {
          //   const cleanUrl = url.replace(/^https?:\/\//, '').split(':')[0] // 프로토콜 제거
          //   const cleanHost = host
          //     .split(':')[0]
          //     .replace(/-[a-z0-9]+\.vercel\.app$/, '.vercel.app') // 서브도메인 제거
          //   const cleanForwardedHost = forwardedHost
          //     ? forwardedHost
          //         .split(':')[0]
          //         .replace(/-[a-z0-9]+\.vercel\.app$/, '.vercel.app')
          //     : ''
          //   return cleanHost === cleanUrl || cleanForwardedHost === cleanUrl
          // }
        )
    const isMatchingViewerUrl = true
    log(`isMatchingViewerUrlDiff: ${isMatchingViewerUrlDiff}`)
    const customDomain = `${forwardedHost ?? host}${
      pathname === '/' ? '' : pathname
    }`
    log(`customDomain: ${customDomain}`)

    if (!isMatchingViewerUrl) {
      log(`Not matching viewer url`)
    }

    // const publishedTypebot = await getTypebotFromPublicId(
    //   context.query.publicId?.toString()
    // )
    const publishedTypebot = isMatchingViewerUrl
      ? await getTypebotFromPublicId(context.query.publicId?.toString())
      : await getTypebotFromCustomDomain(customDomain)
    // const url = `${protocol}://${viewerUrls ?? host}${pathname}`
    return {
      props: {
        publishedTypebot,
        incompatibleBrowser,
        url: `${protocol}://${forwardedHost ?? host}${pathname}`,
        // url: url,
      },
    }
  } catch (err) {
    console.error(err)
  }
  return {
    props: {
      incompatibleBrowser,
      url: `${protocol}://${forwardedHost ?? host}${pathname}`,
    },
  }
}

const getTypebotFromPublicId = async (publicId?: string) => {
  const publishedTypebot = (await prisma.publicTypebot.findFirst({
    where: { typebot: { publicId: publicId ?? '' } },
    select: {
      variables: true,
      settings: true,
      theme: true,
      version: true,
      groups: true,
      edges: true,
      typebotId: true,
      id: true,
      typebot: {
        select: {
          name: true,
          isClosed: true,
          isArchived: true,
          publicId: true,
        },
      },
    },
  })) as TypebotPageProps['publishedTypebot'] | null

  // console.log(`getTypebotFromPublicId publishedTypebot`, publishedTypebot)
  if (isNotDefined(publishedTypebot)) return null
  return publishedTypebot.version
    ? ({
        name: publishedTypebot.typebot.name,
        publicId: publishedTypebot.typebot.publicId ?? null,
        background: publishedTypebot.theme.general?.background ?? {
          type: defaultBackgroundType,
          content: defaultBackgroundColor,
        },
        isHideQueryParamsEnabled:
          publishedTypebot.settings.general?.isHideQueryParamsEnabled ??
          defaultSettings.general.isHideQueryParamsEnabled,
        metadata: publishedTypebot.settings.metadata ?? {},
        font: publishedTypebot.theme.general?.font ?? null,
      } satisfies Pick<
        TypebotV3PageProps,
        | 'name'
        | 'publicId'
        | 'background'
        | 'isHideQueryParamsEnabled'
        | 'metadata'
        | 'font'
      >)
    : publishedTypebot
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getTypebotFromCustomDomain = async (customDomain: string) => {
  const publishedTypebot = (await prisma.publicTypebot.findFirst({
    where: { typebot: { customDomain } },
    select: {
      variables: true,
      settings: true,
      theme: true,
      version: true,
      groups: true,
      edges: true,
      typebotId: true,
      id: true,
      typebot: {
        select: {
          name: true,
          isClosed: true,
          isArchived: true,
          publicId: true,
        },
      },
    },
  })) as TypebotPageProps['publishedTypebot'] | null

  // console.log(`getTypebotFromCustomDomain publishedTypebot`, publishedTypebot)
  if (isNotDefined(publishedTypebot)) return null
  return publishedTypebot.version
    ? ({
        name: publishedTypebot.typebot.name,
        publicId: publishedTypebot.typebot.publicId ?? null,
        background: publishedTypebot.theme.general?.background ?? {
          type: defaultBackgroundType,
          content: defaultBackgroundColor,
        },
        isHideQueryParamsEnabled:
          publishedTypebot.settings.general?.isHideQueryParamsEnabled ??
          defaultSettings.general.isHideQueryParamsEnabled,
        metadata: publishedTypebot.settings.metadata ?? {},
        font: publishedTypebot.theme.general?.font ?? null,
      } satisfies Pick<
        TypebotV3PageProps,
        | 'name'
        | 'publicId'
        | 'background'
        | 'isHideQueryParamsEnabled'
        | 'metadata'
        | 'font'
      >)
    : publishedTypebot
}

const getHost = (
  req?: IncomingMessage
): { host?: string; forwardedHost?: string } => ({
  host: req?.headers ? req.headers.host : window.location.host,
  forwardedHost: req?.headers['x-forwarded-host'] as string | undefined,
})

const App = ({
  publishedTypebot,
  incompatibleBrowser,
  ...props
}: {
  isIE: boolean
  customHeadCode: string | null
  url: string
  publishedTypebot:
    | TypebotPageProps['publishedTypebot']
    | Pick<
        TypebotV3PageProps,
        | 'name'
        | 'publicId'
        | 'background'
        | 'isHideQueryParamsEnabled'
        | 'metadata'
        | 'font'
      >
  incompatibleBrowser: string | null
}) => {
  if (incompatibleBrowser)
    return (
      <ErrorPage
        error={
          new Error(
            `Your web browser: ${incompatibleBrowser}, is not supported.`
          )
        }
      />
    )
  if (
    !publishedTypebot ||
    ('typebot' in publishedTypebot && publishedTypebot.typebot.isArchived)
  )
    return <NotFoundPage />
  if ('typebot' in publishedTypebot && publishedTypebot.typebot.isClosed)
    return <ErrorPage error={new Error('This bot is now closed')} />
  return 'typebot' in publishedTypebot ? (
    <TypebotPageV2 publishedTypebot={publishedTypebot} {...props} />
  ) : (
    <TypebotPageV3
      url={props.url}
      name={publishedTypebot.name}
      publicId={publishedTypebot.publicId}
      isHideQueryParamsEnabled={
        publishedTypebot.isHideQueryParamsEnabled ??
        defaultSettings.general.isHideQueryParamsEnabled
      }
      background={
        publishedTypebot.background ?? {
          type: defaultBackgroundType,
          content: defaultBackgroundColor,
        }
      }
      metadata={publishedTypebot.metadata ?? {}}
      font={publishedTypebot.font}
    />
  )
}

export default App
