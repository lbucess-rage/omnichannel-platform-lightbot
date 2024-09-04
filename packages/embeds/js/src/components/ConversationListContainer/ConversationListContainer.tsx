import { BotContext, MenuType, OutgoingLog } from '../../types'
import { createEffect, Match, Switch } from 'solid-js'
import Header from './Header'
import Navigation from './Navigation'
import BotInfo from './BotInfo'
import { currentMenuType } from '@/utils/currentMenuSignal'
import Messages from './Messages'
// import { ConversationContainer } from '../ConversationContainer'
import { InputBlock, StartChatResponse } from '@typebot.io/schemas'
type Props = {
  initialChatReply: StartChatResponse

  context: BotContext
  menuType: MenuType
  onNewInputBlock?: (inputBlock: InputBlock) => void
  onAnswer?: (answer: { message: string; blockId: string }) => void
  onEnd?: () => void
  onNewLogs?: (logs: OutgoingLog[]) => void
  onProgressUpdate?: (progress: number) => void
}

export const ConversationListContainer = (props: Props) => {
  console.log(`ConversationList Container`, props)

  // 현재 메뉴가 변경되면 호출되는 함수
  createEffect(() => {
    console.log(`currentMenuType`, currentMenuType())
  })

  return (
    <div class="inset-0 bg-[#F7F7F8] text-black shadow-[inset_0_0_2px_0_rgba(255,255,255,0.12),_0_0_2px_1px_rgba(0,0,0,0.05),_0_12px_60px_rgba(0,0,0,0.3)] transition-visibility duration-400 ease-[cubic-bezier(0.36,0,0,1)] relative w-[460px] min-h-[200px] max-h-[690px] overflow-hidden rounded-[30px] will-change-[transform,opacity] bottom-24 right-6 h-[690px]">
      <div class="pb-14 w-full h-full overflow-y-auto scrollbar-none">
        <Switch fallback={<div>{'메뉴 타입 정보 Error! :('}</div>}>
          <Match when={currentMenuType() === MenuType.HOME}>
            <div>
              <Header context={props.context} />
              <BotInfo context={props.context} />
              <div />
              <Navigation />
            </div>
          </Match>
          <Match when={currentMenuType() === MenuType.CONVERSATION}>
            {/* <Header context={props.context} /> */}

            <Messages context={props.context} />
            <Navigation />

            {/* 대화창 렌더링 테스트 */}
            {/* <ConversationContainer
              context={props.context}
              initialChatReply={props.initialChatReply}
              onNewInputBlock={props.onNewInputBlock}
              onAnswer={props.onAnswer}
              onEnd={props.onEnd}
              onNewLogs={props.onNewLogs}
              onProgressUpdate={props.onProgressUpdate}
            />
            <Navigation /> */}
          </Match>
          <Match when={currentMenuType() === MenuType.HELP}>
            {/* <Header context={props.context} /> */}

            <Messages context={props.context} />
            <Navigation />
          </Match>

          <Match when={currentMenuType() === MenuType.SETTINGS}>
            <div>
              <Header context={props.context} />
              <div>SETTING</div>
              <Navigation />
            </div>
          </Match>
        </Switch>
      </div>
    </div>
  )
}

// export default ConversationListContainer
