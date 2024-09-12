import { Block } from '@typebot.io/schemas'
import { IntegrationBlockType } from '@typebot.io/schemas/features/blocks/integrations/constants'

type Feature = 'editor' | Block['type']

export const onboardingVideos: Partial<
  Record<
    Feature,
    | {
        key: string
        youtubeId: string
        deployedAt: Date
      }
    | undefined
  >
> = {
  editor: {
    key: 'editor',
    youtubeId: 'jp3ggg_42-Me21e21e21e21wad',
    deployedAt: new Date('2024-06-04'),
  },
  [IntegrationBlockType.ZAPIER]: {
    key: IntegrationBlockType.ZAPIER,
    youtubeId: '2ZskGItI_Zodawdawd',
    deployedAt: new Date('2024-06-04'),
  },
  [IntegrationBlockType.MAKE_COM]: {
    key: IntegrationBlockType.MAKE_COM,
    youtubeId: 'V-y1Orys_kYd32 e32d32d23d32d23d32',
    deployedAt: new Date('2024-06-04'),
  },
}
