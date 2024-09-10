import {
  ResultWithAnswers,
  ResultWithAnswersChatSessions,
  SessionState,
  Typebot,
} from '@typebot.io/schemas'
import { BotContext, ChatUIModeType } from '../../types'
import { For, Show } from 'solid-js'
import { timeDifference } from '../../utils/timeProcessing'
import { setCurrentChatUIModeType } from '../../utils/currentChatUIModeSignal'
import { isNotDefined } from '@typebot.io/lib'
type Props = {
  context: BotContext
  chatListByMemberId?: ResultWithAnswersChatSessions[]
}

const conversationList: string[] = ['test']

const Messages = (props: Props) => {
  console.log(`Messages Component props:`, props)

  const chatListClickHandler = (sessionId: string | undefined | null) => {
    console.log(`chatListClickHandler: ${sessionId}`)
    if (isNotDefined(sessionId)) {
      console.log(`sessionId is not defined`)
    }

    setCurrentChatUIModeType(ChatUIModeType.CONTINUE)
  }

  return (
    <main class="overflow-hidden relative flex flex-col flex-grow justify-start h-full ">
      <div
        class="absolute top-0 right-0 left-0 bg-[#00bc8f] min-h-[64px] max-h-[64px]"
        style={{
          transition:
            'min-height 150ms ease-out 0s, max-height 150ms ease-out 0s, background-color 150ms ease-in-out 0s',
        }}
      />
      <div class="flex flex-col flex-grow overflow-hidden z-[2]">
        <div class="flex flex-col flex-grow overflow-hidden">
          {/* messages 헤더  */}
          <div class="min-h-fit w-full">
            <nav class="flex flex-col p-2 text-white text-opacity-70">
              <div class="flex flex-grow flex-row items-center justify-between gap-1 min-h-50 text-sm text-white">
                <div class="custom-header-flex" />
                <h1 class="px-1 py-2 font-bold text-center text-lg overflow-hidden text-ellipsis flex gap-2 items-center">
                  Messages
                </h1>
                <div class="flex flex-1 justify-end" />
              </div>
            </nav>
          </div>

          {/* messages 내용  */}
          <div class="flex flex-col flex-1 overflow-hidden">
            <div
              data-testid="messages-body"
              class="flex-1 w-full h-full overflow-y-scroll"
            >
              <Show when={props.chatListByMemberId}>
                <div class="pb-20">
                  <ul class="list-none pl-0">
                    <For each={props.chatListByMemberId}>
                      {(chat, index) => (
                        <li class="list-item group">
                          <div
                            data-testid="conversation-list-item"
                            class="relative flex justify-between box-border text-black p-4 px-5 items-start transition-colors-bg duration-250 ease opacity-100 cursor-pointer group-hover:bg-gray-200 "
                            role="button"
                            tabindex="0"
                          >
                            <div class="mr-2 self-center">
                              <div class="w-8 h-8 relative float-left">
                                {(chat.typebot as Typebot).theme.chat
                                  ?.hostAvatar?.isEnabled &&
                                  (chat.typebot as Typebot).theme.chat
                                    ?.hostAvatar &&
                                  (chat.typebot as Typebot).theme.chat
                                    ?.hostAvatar!.url && (
                                    <img
                                      src={
                                        (chat.typebot as Typebot).theme.chat
                                          ?.hostAvatar!.url
                                      }
                                      // "https://static.intercomassets.com/avatars/6481560/square_128/shwe-1682487791.png"
                                      alt="Shwe avatar"
                                      class="absolute rounded-full border-2 border-custom-white bg-custom-black text-white text-center text-base w-6 h-6 leading-5 top--1 left-3 z-2 transition-custom duration-250 ease"
                                    />
                                  )}
                                {(chat.typebot as Typebot).theme.chat
                                  ?.guestAvatar?.isEnabled &&
                                  (chat.typebot as Typebot).theme.chat
                                    ?.guestAvatar &&
                                  (chat.typebot as Typebot).theme.chat
                                    ?.guestAvatar!.url && (
                                    <img
                                      src={
                                        (chat.typebot as Typebot).theme.chat
                                          ?.guestAvatar!.url
                                      }
                                      // "https://static.intercomassets.com/avatars/6481560/square_128/shwe-1682487791.png"
                                      alt="Shwe avatar"
                                      class="absolute rounded-full border-2 border-custom-white bg-custom-black text-white text-center text-base w-6 h-6 leading-5 top-4 right-4 z-3 transition-custom duration-250 ease"
                                    />
                                  )}

                                {/* <img
                                  src="https://static.intercomassets.com/avatars/6421591/square_128/sean_v2-1680227323.png"
                                  alt="Sean avatar"
                                  class="absolute rounded-full border-2 border-custom-white bg-custom-black text-white text-center text-base w-5 h-5 leading-5 top-4 right-3 z-3 transition-custom duration-250 ease"
                                /> */}
                                {/* <img
                                  src="https://static.intercomassets.com/avatars/7294509/square_128/ravi-pandey-profile-1714094706.png"
                                  alt="Ravi avatar"
                                  class="absolute rounded-full border-2 border-custom-white bg-custom-black text-white text-center text-base w-5 h-5 leading-5 top-4 left-3 z-1 transition-custom duration-250 ease"
                                /> */}
                              </div>
                            </div>
                            {/* 채팅 내용 , 봇이름, 기간 */}
                            <div class="mr-auto flex-1 text-sm min-w-0">
                              <div
                                class="flex flex-col cursor-pointer"
                                onClick={(e) =>
                                  chatListClickHandler(chat.lastChatSessionId)
                                }
                              >
                                <div class="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-normal">
                                  <span class="text-black">
                                    {/* Ready to up-level your teams productivity
                                    with AI? ✨ */}
                                    {(chat.typebot as Typebot)?.name}
                                  </span>
                                </div>
                                <div class="flex font-normal text-sm whitespace-break-spaces color-[rgb(102,102,102)]">
                                  <div class="whitespace-nowrap overflow-hidden overflow-ellipsis mr-1">
                                    {
                                      (chat.typebot as Typebot)?.settings.homeUI
                                        ?.centerName
                                    }
                                  </div>
                                  <div>
                                    {timeDifference(
                                      chat.createdAt as unknown as string
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="ml-2 self-center">
                              <div>
                                <i
                                  color="linkColor"
                                  class="flex items-center w-auto min-w-[16px] h-4 cursor-pointer color-[rgb(0,0,0)]"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                  >
                                    <path
                                      d="M5.42773 4.70898C5.46387 4.85254 5.53809 4.98828 5.65039 5.10059L8.54932 8L5.64893 10.9004C5.31689 11.2324 5.31689 11.7705 5.64893 12.1025C5.98096 12.4336 6.51904 12.4336 6.85107 12.1025L10.3516 8.60059C10.5591 8.39355 10.6367 8.10449 10.585 7.83691C10.5537 7.67578 10.4761 7.52246 10.3516 7.39844L6.85254 3.89941C6.52051 3.56738 5.98242 3.56738 5.65039 3.89941C5.43066 4.11816 5.35645 4.42871 5.42773 4.70898Z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                </i>
                              </div>
                            </div>
                          </div>
                        </li>
                      )}
                    </For>
                  </ul>
                </div>

                <div class="absolute bottom-0 left-0 right-0 z-[2147483001] text-center flex items-center justify-center pointer-events-none custom-border-radius custom-bg-gradient h-24" />
              </Show>

              {/* 대화내역(messages)이 없는 경우  */}
              <Show when={conversationList.length === 0}>
                <div class="flex flex-col items-center justify-center gap-5 mx-[35px] min-h-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33"
                    height="32"
                    fill="none"
                    viewBox="0 0 33 32"
                  >
                    <path
                      fill="#000"
                      fill-rule="evenodd"
                      d="M27.333 2.667a2.5 2.5 0 0 1 2.5 2.5v23.778c0 1.335-1.613 2.005-2.558 1.063L21.245 24H5.667a2.5 2.5 0 0 1-2.5-2.5V5.167a2.5 2.5 0 0 1 2.5-2.5z"
                      clip-rule="evenodd"
                    />
                    <path
                      fill="#fff"
                      fill-rule="evenodd"
                      d="M23 9.667a1 1 0 0 1 0 2H9.667a1 1 0 1 1 0-2zm-6 6.666a1 1 0 1 1 0 2h-6.667a1 1 0 0 1 0-2z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <h2 class="text-base font-semibold">대화 내역 없음</h2>
                  <span class="font-normal text-sm text-center">
                    이전 대화 내역은 여기에 표시됩니다.
                  </span>
                  <button
                    data-testid="send-a-message-button"
                    tabindex="0"
                    class="text-white bg-[#00bc8f] absolute bottom-5  max-w-full box-border p-2.5 px-4 rounded-lg flex justify-center items-center gap-4 cursor-pointer pointer-events-auto text-sm leading-5 font-semibold whitespace-nowrap transition-colors ease-in-out duration-200 hover:bg-custom-teal-dark"
                    style={{
                      width: 'fit-content',

                      'font-family':
                        "system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
                      transition:
                        'color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease-in-out',
                    }}
                  >
                    새로운 문의하기
                    <i class="flex items-center w-auto min-w-[16px] h-4 cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill="currentColor"
                          fill-rule="evenodd"
                          d="m4.394 14.7 9.356-5.4c1-.577 1-2.02 0-2.598L4.394 1.299a1.5 1.5 0 0 0-2.25 1.3v3.438l4.059 1.088c.494.132.494.833 0 .966l-4.06 1.087v4.224a1.5 1.5 0 0 0 2.25 1.299"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </i>
                  </button>
                </div>
              </Show>
            </div>
          </div>

          <div class="relative box-border overflow-y-visible z-[2]">
            <div>
              <div class="opacity-[1] min-w-full min-h-full absolute inset-0 box-border transition-opacity">
                <div class="absolute bottom-5 left-1/2 -translate-x-1/2">
                  <button
                    data-testid="send-a-message-button"
                    tabindex="0"
                    class="relative text-white bg-[#00bc8f] w-fit max-w-full box-border p-[10px] px-4 rounded-lg flex justify-center items-center gap-4 cursor-pointer pointer-events-auto text-sm leading-5  font-semibold transition-colors-bg-shadow duration-200 ease-in-out hover:bg-custom-teal-dark"
                    style={{
                      width: 'fit-content',

                      'font-family':
                        "system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
                      transition:
                        'color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease-in-out',
                    }}
                  >
                    새로운 문의하기
                    <i class="flex items-center w-auto min-w-[16px] h-4 cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill="currentColor"
                          fill-rule="evenodd"
                          d="m4.394 14.7 9.356-5.4c1-.577 1-2.02 0-2.598L4.394 1.299a1.5 1.5 0 0 0-2.25 1.3v3.438l4.059 1.088c.494.132.494.833 0 .966l-4.06 1.087v4.224a1.5 1.5 0 0 0 2.25 1.299"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="relative box-border overflow-y-visible z-[2]" />
    </main>
  )
}

export default Messages
