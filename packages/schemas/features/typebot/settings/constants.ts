export const defaultSettings = {
  general: {
    isInputPrefillEnabled: false,
    isHideQueryParamsEnabled: true,
    isNewResultOnRefreshEnabled: true,
    rememberUser: {
      isEnabled: false,
      storage: 'session',
    },
    isBrandingEnabled: false,
    isTypingEmulationEnabled: true,
  },
  typingEmulation: {
    enabled: true,
    speed: 400,
    maxDelay: 3,
    delayBetweenBubbles: 0,
    isDisabledOnFirstMessage: true,
  },
  metadata: {
    description:
      'Build beautiful conversational forms and embed them directly in your applications without a line of code. Triple your response rate and collect answers that has more value compared to a traditional form.',
    // favIconUrl: (viewerBaseUrl: string) => viewerBaseUrl + '/favicon.png',
    favIconUrl: (viewerBaseUrl: string) =>
      'https://s3.ap-northeast-2.amazonaws.com/lightbot-rage/public/workspaces/clxcr0w2r0001x6khnqxv40kl/typebots/clxcr1dph0007x6kh0nbvq2rk/favIcon?v=1718669668633',
    // imageUrl: (viewerBaseUrl: string) => viewerBaseUrl + '/site-preview.png',
    imageUrl: (viewerBaseUrl: string) =>
      'https://s3.ap-northeast-2.amazonaws.com/lightbot-rage/public/workspaces/clxcr0w2r0001x6khnqxv40kl/typebots/clxcr1dph0007x6kh0nbvq2rk/favIcon?v=1718669668633',
  },

  homeUI: {
    isHomeUIEnabled: true,
    title: '환영합니다~ 라잇봇',
    subTitle: '무엇을 도와드릴까요?',
    centerId: '',
    centerName: '',
    centerUrl: '',
  },
} as const

export const rememberUserStorages = ['session', 'local'] as const
