import { StartChatResponse } from '@typebot.io/schemas/features/chat/schema'
import { defaultSettings } from '@typebot.io/schemas/features/typebot/settings/constants'

const storageResultIdKey = 'resultId'

export const getExistingResultIdFromStorage = (typebotId?: string) => {
  if (!typebotId) return
  try {
    return (
      sessionStorage.getItem(`${storageResultIdKey}-${typebotId}`) ??
      localStorage.getItem(`${storageResultIdKey}-${typebotId}`) ??
      undefined
    )
  } catch {
    /* empty */
  }
}

export const setResultInStorage =
  (storageType: 'local' | 'session' = 'session') =>
  (typebotId: string, resultId: string) => {
    try {
      parseRememberUserStorage(storageType).setItem(
        `${storageResultIdKey}-${typebotId}`,
        resultId
      )
    } catch {
      /* empty */
    }
  }

export const getInitialChatReplyFromStorage = (
  typebotId: string | undefined
) => {
  if (!typebotId) return
  try {
    const rawInitialChatReply =
      sessionStorage.getItem(`lightbot-${typebotId}-initialChatReply`) ??
      localStorage.getItem(`lightbot-${typebotId}-initialChatReply`)
    if (!rawInitialChatReply) return
    return JSON.parse(rawInitialChatReply) as StartChatResponse
  } catch {
    /* empty */
  }
}
export const setInitialChatReplyInStorage = (
  initialChatReply: StartChatResponse,
  {
    typebotId,
    storage,
  }: {
    typebotId: string
    storage?: 'local' | 'session'
  }
) => {
  try {
    const rawInitialChatReply = JSON.stringify(initialChatReply)
    parseRememberUserStorage(storage).setItem(
      `lightbot-${typebotId}-initialChatReply`,
      rawInitialChatReply
    )
  } catch {
    /* empty */
  }
}

export const setBotOpenedStateInStorage = () => {
  try {
    sessionStorage.setItem(`lightbot-botOpened`, 'true')
  } catch {
    /* empty */
  }
}

export const removeBotOpenedStateInStorage = () => {
  try {
    sessionStorage.removeItem(`lightbot-botOpened`)
  } catch {
    /* empty */
  }
}

export const getBotOpenedStateFromStorage = () => {
  try {
    return sessionStorage.getItem(`lightbot-botOpened`) === 'true'
  } catch {
    return false
  }
}

export const parseRememberUserStorage = (
  storage: 'local' | 'session' | undefined
): typeof localStorage | typeof sessionStorage =>
  (storage ?? defaultSettings.general.rememberUser.storage) === 'session'
    ? sessionStorage
    : localStorage

export const wipeExistingChatStateInStorage = (typebotId: string) => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(`lightbot-${typebotId}`)) localStorage.removeItem(key)
  })
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith(`lightbot-${typebotId}`)) sessionStorage.removeItem(key)
  })
}
