/* eslint-disable react/jsx-key */
/* eslint-disable solid/prefer-for */
import { BotContext } from '../../types'
import { createSignal } from 'solid-js'

type Props = {
  context: BotContext
}

export const BotInfo = (props: Props) => {
  const [currentSlide] = createSignal(0)
  const slides = [
    {
      title: 'Card 1',
      content: 'Content for the first card.',
      image: 'https://via.placeholder.com/400x300',
    },
    {
      title: 'Card 2',
      content: 'Content for the second card.',
      image: 'https://via.placeholder.com/400x300',
    },
    {
      title: 'Card 3',
      content: 'Content for the third card.',
      image: 'https://via.placeholder.com/400x300',
    },
  ]
  console.log(props, currentSlide, slides)
  //   const nextSlide = () => {
  //     setCurrentSlide((prev) => (prev + 1) % slides.length)
  //   }

  //   const prevSlide = () => {
  //     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  //   }

  return (
    <div class="container relative w-full px-4 flex flex-col gap-3 -mt-[125px] mx-auto py-8">
      {/* 문의 하기 버튼 */}
      <div
        role="button"
        tabIndex={0}
        class="relative box-border overflow-hidden p-0 bg-white rounded-[10px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_2px_8px_rgba(0,0,0,0.06)]"
      >
        <div class="flex justify-between box-border text-black px-5 py-4 items-center opacity-100 cursor-pointer">
          <div class="mr-auto flex-1 text-sm leading-[21px] min-w-0">
            <div
              class="text-black font-semibold text-sm leading-[150%] p-0 cursor-pointer transition-colors duration-250 ease hover:text-custom-hover-green-color"
              style={{
                'font-family':
                  "system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
              }}
            >
              궁금한 사항을 말해주세요~ 💬
            </div>
            <div class="cursor-pointer text-[rgb(115,115,115)] text-sm " />
          </div>
          <div class="ml-2 self-center cursor-pointer">
            <div class="cursor-pointer">
              <i
                color="linkColor"
                class="cursor-pointer flex items-center w-auto min-w-[16px] h-4 text-[rgb(0,188,143)]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="16"
                  fill="none"
                  viewBox="0 0 17 16"
                  color="linkColor"
                >
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="m4.563 14.605 9.356-5.402c1-.577 1-2.02 0-2.598L4.563 1.203a1.5 1.5 0 0 0-2.25 1.3v10.803a1.5 1.5 0 0 0 2.25 1.3M6.51 8.387 2.313 9.512V6.297L6.51 7.42c.494.133.494.834 0 .966"
                    clip-rule="evenodd"
                  />
                </svg>
              </i>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ 형태 UI */}
      <div
        class="relative box-border overflow-hidden p-0 bg-white rounded-[10px]"
        style={{
          'box-shadow':
            'rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 2px 8px',
        }}
      >
        <div class="flex flex-col gap-2 p-2 text-sm leading-[21px] hover:text-custom-hover-green-color">
          <button
            class="flex justify-between items-center w-full h-10 box-border px-3 py-2 font-semibold bg-gray-100 rounded-lg transition-colors duration-250 ease"
            tabindex={0}
          >
            <span class="cursor-pointer font-semibold">Search for Help</span>
            <i
              color="linkColor"
              class="flex items-center w-auto min-w-[16px] h-4"
              style={{ color: 'rgb(0, 188, 143)' }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="7.5"
                  cy="7.5"
                  r="4.625"
                  stroke="currentColor"
                  stroke-width="1.75"
                />
                <path
                  d="M13.3813 14.6187C13.723 14.9604 14.277 14.9604 14.6187 14.6187C14.9604 14.277 14.9604 13.723 14.6187 13.3813L13.3813 14.6187ZM10.3813 11.6187L13.3813 14.6187L14.6187 13.3813L11.6187 10.3813L10.3813 11.6187Z"
                  fill="currentColor"
                />
              </svg>
            </i>
          </button>
          <div class="py-0 px-0 text-sm">
            <ul
              class="p-0 my-4 mx-0 isolate text-left list-none block"
              style={{
                'font-family':
                  "system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
                'font-size': '100%',
                'font-style': 'normal',
                'letter-spacing': 'normal',
                'font-stretch': 'normal',
                'font-variant': 'normal',
                'font-weight': 'normal',
                'text-align-last': 'initial',
                'text-decoration': 'none',
                'text-emphasis': 'none',
                'text-indent': '0px',
                'text-shadow': 'none',
                'text-transform': 'none',
              }}
            >
              <li>
                <div
                  data-testid="search-browse-item"
                  role="button"
                  tabindex="0"
                  class="flex justify-between box-border text-black px-3 py-2 items-center rounded-lg opacity-100 cursor-pointer transition-colors duration-250 ease"
                  style={{
                    transition:
                      'color 250ms ease 0s, background-color 250ms ease 0s',
                  }}
                >
                  <div class="mr-auto flex-1 text-sm leading-[21px] min-w-0 hover:text-custom-hover-green-color">
                    <div class="leading-6">주문, 배송, 취소 관련 문의</div>
                  </div>
                  <div class="ml-2 self-center cursor-pointer">
                    <div class="cursor-pointer">
                      <i
                        color="linkColor"
                        class="cursor-pointer flex items-center w-auto min-w-[16px] h-4 text-[rgb(0,188,143)]"
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

              {/* 2ea */}
              <li>
                <div
                  data-testid="search-browse-item"
                  role="button"
                  tabindex="0"
                  class="flex justify-between box-border text-black px-3 py-2 items-center rounded-lg opacity-100 cursor-pointer transition-colors duration-250 ease"
                  style={{
                    transition:
                      'color 250ms ease 0s, background-color 250ms ease 0s',
                  }}
                >
                  <div class="mr-auto flex-1 text-sm leading-[21px] min-w-0 hover:text-custom-hover-green-color">
                    <div class="leading-6">회원 가입 방법 문의</div>
                  </div>
                  <div class="ml-2 self-center cursor-pointer">
                    <div class="cursor-pointer">
                      <i
                        color="linkColor"
                        class="cursor-pointer flex items-center w-auto min-w-[16px] h-4 text-[rgb(0,188,143)]"
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

              {/* 3ea */}
              <li>
                <div
                  data-testid="search-browse-item"
                  role="button"
                  tabindex="0"
                  class="flex justify-between box-border text-black px-3 py-2 items-center rounded-lg opacity-100 cursor-pointer transition-colors duration-250 ease"
                  style={{
                    transition:
                      'color 250ms ease 0s, background-color 250ms ease 0s',
                  }}
                >
                  <div class="mr-auto flex-1 text-sm leading-[21px] min-w-0 hover:text-custom-hover-green-color">
                    <div class="leading-6">찾아오시는 길 🚗</div>
                  </div>
                  <div class="ml-2 self-center cursor-pointer">
                    <div class="cursor-pointer">
                      <i
                        color="linkColor"
                        class="cursor-pointer flex items-center w-auto min-w-[16px] h-4 text-[rgb(0,188,143)]"
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
            </ul>
          </div>
        </div>
      </div>

      {/* 추가 안내 영역 - 공지, 프로모션 등 */}
      <div class="lbucess-home-screen-messenger-card lbucess-home-screen-messenger-card-1">
        <div
          class="block text-sm leading-6 text-black transition-all duration-300 ease-in-out relative box-border overflow-hidden p-0 bg-white rounded-lg shadow-lg"
          style={{ height: '116px' }}
        >
          <div class="h-fit">
            <div data-testid="messenger-card-body">
              <div
                style={{
                  transition: 'opacity 300ms ease-in-out 0s',
                  opacity: '1',
                }}
              >
                <div class="p-4 px-5 leading-6 text-sm text-black">
                  <div class="text-sm text-black">
                    <div>
                      <div>
                        <div class="lbucess-messenger-card-component">
                          <div class="relative -m-4 -mx-5 select-none tap-highlight-black-transparent transition-colors duration-200 ease-in-out border-t-0 border-b-0 ">
                            <div
                              class="bg-white p-4 px-5 border-b border-gray-200 flex flex-row justify-start items-center relative cursor-pointer last:border-b-0"
                              aria-disabled="false"
                              role="button"
                              tabindex="0"
                            >
                              <div class="flex-1 flex flex-col justify-center cursor-pointer">
                                <div class="text-gray-900 font-semibold text-sm hover:text-custom-hover-green-color">
                                  The Ultimate Guide To LBUCESS Contact Center
                                  Services
                                </div>
                                <div class="text-gray-600 text-sm">
                                  <span class="cursor-pointer">
                                    Learn how Design Pickle can save you time
                                    and money so you can focus on what you are
                                    best at.
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 추가 안내 영역 -버튼 포함 */}
      <div class="lbucess-home-screen-messenger-card lbucess-home-screen-messenger-card-2">
        <div
          class="block text-sm leading-6 text-black transition-all duration-300 ease-in-out relative box-border overflow-hidden p-0 bg-white rounded-lg shadow-lg"
          style={{ height: '203px' }}
        >
          <div class="min-h-fit">
            <div data-testid="messenger-card-body">
              <div
                style={{
                  transition: 'opacity 300ms ease-in-out 0s',
                  opacity: '1',
                }}
              >
                <div class="p-4 px-5 leading-6 text-sm text-black">
                  <div class="text-sm text-black">
                    <div>
                      <div>
                        <div class="lbucess-messenger-card-component">
                          <h2 class="leading-6 mb-2 break-words text-left font-semibold text-sm">
                            LBUCESS Lightchat Demo
                          </h2>
                        </div>
                        <div class="lbucess-messenger-card-component">
                          <div class="leading-6 mb-2 break-words text-left text-sm">
                            Get a virtual tour of Design Pickles game-changing
                            creative services. I look forward to learning more
                            about your business, creative workflow and answering
                            all of your questions.
                          </div>
                        </div>
                        <div class="lbucess-messenger-card-component">
                          <button
                            class="relative w-full min-h-10 p-1.5 px-3 box-border rounded-lg text-center font-bold pointer-events-auto cursor-pointer select-none mb-0 bg-custom-teal text-white transition-custom duration-120 ease-in-out hover:bg-custom-teal-dark"
                            aria-label="Request a demo"
                            tabindex="0"
                          >
                            Request a demo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 카드 가로 슬라이드 형태 UI */}
      <div class="flex overflow-x-scroll space-x-4">
        <div class="card bg-base-100 w-96 shadow-xl flex-shrink-0">
          <figure>
            <img
              src="https://chatapp-static-hosting-rage.s3.ap-northeast-2.amazonaws.com/lightbot/background/circuit-board-and-ai-micro-processor-artificial-i-2023-11-27-05-28-41-utc.jpg"
              alt="Shoes"
            />
          </figure>
          <div class="card-body">
            <h2 class="card-title">AI Bot</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div class="card-actions justify-end">
              <button class="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 w-96 shadow-xl flex-shrink-0">
          <figure>
            <img
              src="https://chatapp-static-hosting-rage.s3.ap-northeast-2.amazonaws.com/lightbot/background/mountain-landscape-with-colorful-vivid-sunset-on-t-2024-01-31-23-47-02-utc.jpg"
              alt="Shoes"
            />
          </figure>
          <div class="card-body">
            <h2 class="card-title">
              Sales!
              <div class="badge badge-secondary">NEW</div>
            </h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div class="card-actions justify-end">
              <div class="badge badge-outline">Fashion</div>
              <div class="badge badge-outline">Products</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BotInfo
