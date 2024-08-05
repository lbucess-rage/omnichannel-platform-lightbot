import { createAction, option } from '@typebot.io/forge'
import { defaultOptions } from '../defaultOptions'
import { defaultLightchatOptions } from '../constants'

export const connectChat = createAction({
  name: 'Connect Chat Sevrer',
  baseOptions: defaultOptions,
  options: option.object({
    centerId: option.string.layout({
      // label: '상담AP centerId',
      // placeholder: '선택 centerId 예시',
      label: '상담AP centerId',
      fetcher: 'fetchCenterIds',
    }),

    layout: option.enum(['Call', 'Chat', 'Video']).layout({
      label: '상담AP Channel Type',
      defaultValue: 'Chat',
      direction: 'row',
    }),
    userKey: option.string.layout({
      accordion: '사용자 식별정보',
      label: 'userKey',
      placeholder: '라잇봇 내 관리 사용자 id',
    }),
    memberId: option.string.layout({
      accordion: '사용자 회원ID',
      label: 'memberId',
      placeholder: '회원정보 내 식별ID',
    }),
    userName: option.string.layout({
      accordion: '사용자 이름',
      label: 'userName',
      placeholder: '사용자 이름',
    }),
    sessionId: option.string.layout({
      accordion: '사용자 세션ID',
      label: 'sessionId',
      placeholder: '사용자 세션ID',
    }),
  }),

  // 조회자를 미리 만들어 놓은 후 옵션 객체의 콤보나 리스트 조회 함수로 제공하거나, 모니터링 대상 필드를 지정하여 변경 시 호출되도록 설정 가능
  fetchers: [
    {
      id: 'fetchCenterIds',
      dependencies: [],
      fetch: async ({ credentials, options }) => {
        return [
          {
            label: 'C001',
            value: 'C001',
          },
          {
            label: 'C002',
            value: 'C002',
          },
          {
            label: 'C003',
            value: 'C003',
          },
        ]
      },
    },
  ],

  /**
   * 다음과 같은 액션중 하나를 실행
   *
   * - 서버에서 function 실행
   * - 블록 다음에 스트리밍 가능한 변수가 있으면 클라이언트에서 변수를 스트리밍합니다. 그렇지 않으면 서버에서 함수를 실행
   * - 클라이언트에서 function 실행
   * - 커스텀 임베드 버블을 표시
   */
  // getSetVariableIds: ({ customerId }) => {
  //   if (customerId) {
  //     console.log(`customerId`, customerId)
  //     return [customerId]
  //   }
  //   return []
  // },
  run: {
    // 블럭이 트리거될 때 서버에서 실행되는 함수
    server: async ({ credentials, options, variables, logs }) => {
      // console.log(`[action][connectChat] run(server)`, {
      //   credentials,
      //   options,
      //   variables,
      //   logs,
      // })
    },

    web: {
      // displayEmbedBubble: {
      //   parseInitFunction: (params) => {
      //     console.log(`web displayEmbedBubble parseInitFunction`, params)
      //     params.options.restApiUrl = defaultLightchatOptions.restApiUrl || ''
      //     params.options.socketUrl = defaultLightchatOptions.socketUrl || ''
      //     return {
      //       args: {
      //         componentType: 'lightbot',
      //         socketUrl: params.options.socketUrl,
      //         restApiUrl: params.options.restApiUrl,
      //       },
      //       content: `console.log('Connect ChatServer - client execute', ${JSON.stringify(
      //         params.options
      //       )});

      //       console.log(typebotElement)

      //       `,
      //     }
      //   },

      //   parseUrl: (params) => {
      //     console.log(`web displayEmbedBubble parseUrl`, params)
      //     return params.options.socketUrl || params.options.restApiUrl
      //   },

      //   waitForEvent: {
      //     parseFunction: (params) => {
      //       console.log(
      //         `web displayEmbedBubble waitForEvent parseFunction`,
      //         params
      //       )

      //       return {
      //         args: {},
      //         content: `
      //         console.log('Connect ChatServer - waitForEvent execute', ${JSON.stringify(
      //           params.options
      //         )});
      //         `,
      //       }
      //     },
      //   },
      // },

      parseFunction: (params) => {
        console.log(`[action][connectChat] run(web)`, params)
        params.options.restApiUrl = defaultLightchatOptions.restApiUrl || ''
        params.options.socketUrl = defaultLightchatOptions.socketUrl || ''
        return {
          args: {
            options: JSON.stringify(params.options) ?? '',
          },
          content: `
          console.log('클라이언트에서 실행되는 코드 options:',options)
          
          `,
        }
      },
    },
    // web: ({ options }) => {
    //   return {
    //     args: {
    //       name: options.name ?? null,
    //     },
    //     content: `alert('Hello ' + name)`,
    //   }
    // },
    // // web: {

    //   parseFunction(params) {
    //     console.log(`[action][connectChat] run(web)`, params)
    //   },
    // }
    /*
      displayEmbedBubble: {
        parseInitFunction: () => {},

        waitForEvent: {
          parseFunction: () => {},

          // waitForEvent 함수의 결과로 저장할 변수 ID를 반환
          getSaveVariableId(options) {},
        },
      },
      */
  },
})
