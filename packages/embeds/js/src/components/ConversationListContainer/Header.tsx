/* eslint-disable jsx-a11y/alt-text */
import { BotContext } from '../../types'

type Props = {
  context: BotContext
}

const Header = (props: Props) => {
  return (
    // <header class="flex p-2 m-4 mb-3 overflow-hidden opacity-100 ">
    //   <div class="relative flex items-center justify-center overflow-hidden bg-white w-14 h-14 rounded-[23.52px] shrink-0 mr-1.5">
    //     {/* <img
    //             width="56"
    //             height="56"
    //             object-fit="cover"
    //             src="https://chatapp-static-hosting-rage.s3.ap-northeast-2.amazonaws.com/webchat-common/tmp-293566694.webp"
    //             alt=""
    //           /> */}

    //     <img
    //       // src="https://chatapp-static-hosting-rage.s3.ap-northeast-2.amazonaws.com/lightbot/cardoc/logo/image_cardoc.webp"
    //       src={props.context.typebot.settings.metadata?.imageUrl}
    //       width="56"
    //       height="56"
    //       object-fit="cover"
    //     />
    //   </div>

    //   <div style={{ overflow: 'hidden' }}>
    //     <div>
    //       <h1 class="text-xl leading-tight whitespace-nowrap overflow-hidden text-ellipsis pl-2 mb-1 font-bold text-gray-700">
    //         {props.context.typebot.settings.metadata?.title}
    //       </h1>
    //     </div>
    //     {/* <button class="rcw-logo-subtitle-button"> */}
    //     <div class="flex flex-col flex-wrap">
    //       <span class="text-base leading-tight ml-2 mb-1 font-normal transition-colors duration-150">
    //         - 상담 운영시간
    //       </span>
    //       <span class="text-base leading-tight ml-2 mb-1 font-normal transition-colors duration-150">
    //         - 09:00~18:00{' '}
    //       </span>
    //       <span class="text-base leading-tight ml-2 mb-1 font-normal transition-colors duration-150">
    //         - 점심시간: 12:30~13:30
    //       </span>
    //       <span class="text-base leading-tight ml-2 mb-1 font-normal transition-colors duration-150">
    //         - 주말, 공휴일 휴무
    //       </span>
    //     </div>
    //     {/* </button> */}
    //   </div>
    // </header>
    <div class="min-h-fit">
      <div class="relative">
        <div class=" h-[300px] w-full fixed top-0 left-0 transform translate-z-0 z-[-1] bg-gradient-to-b from-[#00bc8f] to-[#00bc8f33]">
          <div class="absolute bottom-0 left-0 h-[100px] w-full opacity-100 z-0 bg-gradient-to-b from-white/0 to-white" />
        </div>
        <div class="p-8 pt-8 pb-[140px] pr-9 pl-9 box-border bg-no-repeat relative text-blue-950 opacity-[0.996528]">
          <div class="flex flex-row justify-between items-center mb-14 h-10">
            <div class="mr-8 mt-1 text-2xl text-bold overflow-hidden">
              <img
                // src="https://chatapp-static-hosting-rage.s3.ap-northeast-2.amazonaws.com/lightbot/cardoc/logo/image_cardoc.webp"
                src={props.context.typebot.settings.metadata?.imageUrl}
                width="56"
                height="56"
                object-fit="cover"
              />
            </div>
            <div>
              <h4 class="text-bold text-white opacity-100 text-left">
                {props.context.typebot.settings.metadata?.title}
              </h4>
            </div>
            <div class="ml-0">
              <div class="flex flex-none items-center mr-1.5 whitespace-nowrap w-fit overflow-hidden leading-none">
                <div class="inline-block z-10">
                  <div class="m-0 mx-auto rounded-full inline-block align-middle cursor-default relative w-10 h-10 leading-10 text-2xl">
                    <img
                      class="w-10 h-10 rounded-full bg-[#004e3c]"
                      src="https://chatapp-static-hosting-rage.s3.ap-northeast-2.amazonaws.com/webchat-common/avatar/19.png"
                      alt="Profile image for Kitz"
                    />
                  </div>
                </div>

                <div class="inline-block z-10">
                  <div class="m-0 mx-auto rounded-full inline-block align-middle cursor-default relative w-10 h-10 leading-10 text-2xl">
                    <img
                      class="w-10 h-10 rounded-full bg-[#004e3c]"
                      src="https://chatapp-static-hosting-rage.s3.ap-northeast-2.amazonaws.com/webchat-common/avatar/13.png"
                      alt="Profile image for Kitz"
                    />
                  </div>
                </div>

                <div class="inline-block z-10">
                  <div class="m-0 mx-auto rounded-full inline-block align-middle cursor-default relative w-10 h-10 leading-10 text-2xl">
                    <img
                      class="w-10 h-10 rounded-full bg-[#004e3c]"
                      src="https://chatapp-static-hosting-rage.s3.ap-northeast-2.amazonaws.com/webchat-common/avatar/07.png"
                      alt="Profile image for Kitz"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="text-[32px] leading-[38px]">
            <h1 class="opacity-100 text-white font-bold">Hi there 👋</h1>
            <h3 class="opacity-100 text-white font-bold">
              무엇을 도와드릴까요~?
            </h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
