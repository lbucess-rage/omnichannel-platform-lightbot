import { Answer, BotContext, ChatChunk as ChatChunkType } from '@/types'
import { isMobile } from '@/utils/isMobileSignal'
import { ContinueChatResponse, Settings, Theme } from '@typebot.io/schemas'
import { createSignal, For, onMount, Show } from 'solid-js'
import { HostBubble } from '../bubbles/HostBubble'
import { InputChatBlock } from '../InputChatBlock'
import { AvatarSideContainer } from './AvatarSideContainer'
import { StreamingBubble } from '../bubbles/StreamingBubble'
import { defaultSettings } from '@typebot.io/schemas/features/typebot/settings/constants'
import {
  defaultGuestAvatarIsEnabled,
  defaultHostAvatarIsEnabled,
} from '@typebot.io/schemas/features/typebot/theme/constants'

type Props = Pick<ContinueChatResponse, 'messages' | 'input'> & {
  theme: Theme
  settings: Settings
  index: number
  context: BotContext
  hasError: boolean
  hideAvatar: boolean
  streamingMessageId: ChatChunkType['streamingMessageId']
  isTransitionDisabled?: boolean
  onNewBubbleDisplayed: (blockId: string) => Promise<void>
  onScrollToBottom: (ref?: HTMLDivElement, offset?: number) => void
  onSubmit: (answer?: string, attachments?: Answer['attachments']) => void
  onSkip: () => void
  onAllBubblesDisplayed: () => void
}

/**
 * Chunk는 처음 챗이 시작되거나 마지막 입력 이후 대화가 시작된 메시지부터 다시 입력을 받거나 입력이 없는 경우 최종 시나리오까지 메시지를 포함
 */

export const ChatChunk = (props: Props) => {
  console.log(`ChatChunk props`, props)
  let inputRef: HTMLDivElement | undefined

  // 현재 표시된 메세지의 인덱스를 관리하는 Signal 생성
  const [displayedMessageIndex, setDisplayedMessageIndex] = createSignal(
    props.isTransitionDisabled ? props.messages.length : 0
  )

  // 마지막으로 표시된 버블을 관리하는 Signal 생성
  const [lastBubble, setLastBubble] = createSignal<HTMLDivElement>()

  // 컴포넌트가 마운트되면 실행
  onMount(() => {
    // 스트리밍 메세지가 있으면 종료
    if (props.streamingMessageId) return
    // 메세지가 없으면 모든 버블이 표시되었음을 알림
    if (props.messages.length === 0) {
      props.onAllBubblesDisplayed()
    }
    // 스크롤을 맨 아래로 이동
    props.onScrollToBottom(inputRef, 50)
  })

  // 다음 메세지를 표시하는 함수
  const displayNextMessage = async (bubbleRef?: HTMLDivElement) => {
    if (
      (props.settings.typingEmulation?.delayBetweenBubbles ??
        defaultSettings.typingEmulation.delayBetweenBubbles) > 0 &&
      displayedMessageIndex() < props.messages.length - 1
    ) {
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          (props.settings.typingEmulation?.delayBetweenBubbles ??
            defaultSettings.typingEmulation.delayBetweenBubbles) * 1000
        )
      )
    }

    // 마지막으로 표시된 버블의 ID를 가져옴
    const lastBubbleBlockId = props.messages[displayedMessageIndex()].id

    // 마지막 버블이 표시되었음을 알림
    await props.onNewBubbleDisplayed(lastBubbleBlockId)

    // 디스플레이된 메시지 인덱스를 1 증가시켜서 표시된 메시지 인덱스를 업데이트
    setDisplayedMessageIndex(
      displayedMessageIndex() === props.messages.length
        ? displayedMessageIndex()
        : displayedMessageIndex() + 1
    )

    // 스크롤을 맨 아래로 이동
    props.onScrollToBottom(bubbleRef)

    // 모든 버블이 표시되었으면 마지막으로 표시된 버블을 업데이트하고 모든 버블이 표시되었음을 알
    if (displayedMessageIndex() === props.messages.length) {
      setLastBubble(bubbleRef)
      props.onAllBubblesDisplayed()
    }
  }

  return (
    // 입력을 포함한 chunk 컨테이너 div
    <div class="flex flex-col w-full min-w-0 gap-2 typebot-chat-chunk">
      {/* 메세지가 있을때만 렌더링 */}
      <Show when={props.messages.length > 0}>
        <div class={'flex' + (isMobile() ? ' gap-1' : ' gap-2')}>
          <Show
            when={
              (props.theme.chat?.hostAvatar?.isEnabled ??
                defaultHostAvatarIsEnabled) &&
              props.messages.length > 0
            }
          >
            <AvatarSideContainer
              hostAvatarSrc={props.theme.chat?.hostAvatar?.url}
              hideAvatar={props.hideAvatar}
              isTransitionDisabled={props.isTransitionDisabled}
            />
          </Show>

          <div
            class="flex flex-col flex-1 gap-2"
            style={{
              'max-width':
                props.theme.chat?.guestAvatar?.isEnabled ??
                defaultGuestAvatarIsEnabled
                  ? isMobile()
                    ? 'calc(100% - 60px)'
                    : 'calc(100% - 48px - 48px)'
                  : '100%',
            }}
          >
            <For each={props.messages.slice(0, displayedMessageIndex() + 1)}>
              {(message, idx) => (
                <HostBubble
                  message={message}
                  typingEmulation={props.settings.typingEmulation}
                  isTypingSkipped={
                    (props.settings.typingEmulation?.isDisabledOnFirstMessage ??
                      defaultSettings.typingEmulation
                        .isDisabledOnFirstMessage) &&
                    props.index === 0 &&
                    idx() === 0
                  }
                  onTransitionEnd={
                    props.isTransitionDisabled ? undefined : displayNextMessage
                  }
                  onCompleted={props.onSubmit}
                />
              )}
            </For>
          </div>
        </div>
      </Show>

      {/* 
          chunk에 input이 있고, 표시된 메시지 인덱스가 메시지 길이와 같으면(모든 메시지가 표시되었으면) 입력 컴포넌트를 렌더링
      */}
      {props.input && displayedMessageIndex() === props.messages.length && (
        <InputChatBlock
          ref={inputRef}
          block={props.input}
          chunkIndex={props.index}
          hasHostAvatar={
            props.theme.chat?.hostAvatar?.isEnabled ??
            defaultHostAvatarIsEnabled
          }
          guestAvatar={props.theme.chat?.guestAvatar}
          context={props.context}
          isInputPrefillEnabled={
            props.settings.general?.isInputPrefillEnabled ??
            defaultSettings.general.isInputPrefillEnabled
          }
          hasError={props.hasError}
          onTransitionEnd={() => props.onScrollToBottom(lastBubble())}
          onSubmit={props.onSubmit}
          onSkip={props.onSkip}
        />
      )}
      <Show when={props.streamingMessageId} keyed>
        {(streamingMessageId) => (
          <div class={'flex' + (isMobile() ? ' gap-1' : ' gap-2')}>
            <Show
              when={
                props.theme.chat?.hostAvatar?.isEnabled ??
                defaultHostAvatarIsEnabled
              }
            >
              <AvatarSideContainer
                hostAvatarSrc={props.theme.chat?.hostAvatar?.url}
                hideAvatar={props.hideAvatar}
              />
            </Show>

            <div
              class="flex flex-col flex-1 gap-2"
              style={{
                'max-width':
                  props.theme.chat?.guestAvatar?.isEnabled ??
                  defaultGuestAvatarIsEnabled
                    ? isMobile()
                      ? 'calc(100% - 60px)'
                      : 'calc(100% - 48px - 48px)'
                    : '100%',
              }}
            >
              <StreamingBubble
                streamingMessageId={streamingMessageId}
                context={props.context}
              />
            </div>
          </div>
        )}
      </Show>
    </div>
  )
}
