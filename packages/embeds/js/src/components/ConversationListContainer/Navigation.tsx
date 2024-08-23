import { MenuType } from '../../types'
import {
  currentMenuType,
  setCurrentMenuType,
} from '../../utils/currentMenuSignal'
import { createEffect } from 'solid-js'

const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      fill-rule="evenodd"
      d="M3 20a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a2 2 0 1 1 4 0v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V9.978a2 2 0 0 0-.772-1.579l-7.614-5.922a1 1 0 0 0-1.228 0L3.772 8.4A2 2 0 0 0 3 9.98V20Z"
      clip-rule="evenodd"
    />
  </svg>
)

const ConversationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      fill-rule="evenodd"
      d="m21.406 19.052-.641-1.924c-.06-.205-.034-.256.307-.948l.053-.109c.29-.635.506-1.305.654-1.988.299-1.37.287-2.798.01-4.157-.56-2.763-2.358-5.2-4.778-6.599-1.206-.7-2.575-1.159-3.965-1.27-1.38-.142-2.805-.024-4.136.417a10.132 10.132 0 0 0-6.051 5.449A9.626 9.626 0 0 0 2 11.994c.011 1.383.258 2.798.848 4.074 1.139 2.565 3.39 4.577 6.056 5.445 1.337.43 2.749.58 4.14.432a9.906 9.906 0 0 0 3.026-.819c.155-.066.335-.157.48-.231.138-.071.244-.125.265-.124a.509.509 0 0 1 .313-.007l.894.298 1.027.342c.103.033.208.069.313.105.194.067.389.134.577.177.291.05.513.014.712-.042.432-.111.88-.557.992-.99.057-.2.094-.42.044-.71-.041-.186-.107-.378-.174-.57-.037-.107-.074-.215-.107-.322Zm-2.546-2.834a2.51 2.51 0 0 0 .006 1.544l.553 1.656-.764-.254-.896-.3a2.51 2.51 0 0 0-1.544-.003 4.38 4.38 0 0 0-.67.299c-.099.052-.185.098-.294.14a7.805 7.805 0 0 1-.783.303c-.53.177-1.079.29-1.633.351a8.065 8.065 0 0 1-3.313-.344c-2.121-.69-3.944-2.315-4.848-4.36-.47-1.013-.66-2.132-.672-3.256a7.627 7.627 0 0 1 .684-3.255 8.128 8.128 0 0 1 4.841-4.36c1.062-.354 2.2-.445 3.316-.331 1.122.086 2.194.45 3.163 1.01 1.938 1.12 3.382 3.083 3.822 5.268a8.112 8.112 0 0 1-.007 3.336 7.815 7.815 0 0 1-.521 1.59c-.042.11-.089.199-.143.3-.081.15-.178.332-.297.666ZM6.206 11.993c0 .744.609 1.353 1.353 1.353.745 0 1.353-.609 1.353-1.353S8.304 10.64 7.56 10.64c-.744 0-1.353.608-1.353 1.352Zm4.48 0c0 .744.61 1.353 1.354 1.353.745 0 1.353-.609 1.353-1.353s-.609-1.352-1.353-1.352-1.353.608-1.353 1.352Zm5.835 1.353a1.356 1.356 0 0 1-1.353-1.353c0-.744.608-1.352 1.353-1.352.744 0 1.353.608 1.353 1.352 0 .744-.61 1.353-1.353 1.353Z"
      clip-rule="evenodd"
    />
  </svg>
)

const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      fill-rule="evenodd"
      d="M7 12a5 5 0 1 1 10 0 5 5 0 0 1-10 0Zm15 1.5v-3l-2.23-.372a7.94 7.94 0 0 0-.955-2.296l1.316-1.843-2.12-2.12-1.844 1.316a7.933 7.933 0 0 0-2.295-.955L13.5 2h-3l-.372 2.23a7.94 7.94 0 0 0-2.296.955L5.99 3.868 3.87 5.99l1.315 1.843a7.937 7.937 0 0 0-.954 2.296L2 10.5v3l2.23.372c.198.822.523 1.594.954 2.296l-1.316 1.843 2.121 2.121 1.843-1.317a7.967 7.967 0 0 0 2.296.955L10.5 22h3l.372-2.23a7.961 7.961 0 0 0 2.295-.955l1.843 1.317 2.121-2.12-1.316-1.844a7.94 7.94 0 0 0 .955-2.296L22 13.5Z"
      clip-rule="evenodd"
    />
  </svg>
)

const HelpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <mask id="cddaa" fill="#fff">
      <path
        fill-rule="evenodd"
        d="M22.5 12c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12 6.201 1.5 12 1.5 22.5 6.201 22.5 12M11.926 7.85a1.56 1.56 0 0 0-1.465 1.02.85.85 0 1 1-1.594-.588 3.26 3.26 0 1 1 5.547 3.233l-.019.022-.02.021-1.075 1.105-.006.006-.006.006c-.319.315-.512.534-.512.94v.363a.85.85 0 0 1-1.7 0v-.364c0-1.144.664-1.8 1.003-2.134l.009-.008 1.046-1.076a1.56 1.56 0 0 0-1.208-2.546m0 9.917a.884.884 0 1 0 0-1.767.884.884 0 0 0 0 1.767"
        clip-rule="evenodd"
        shape-rendering="crispEdges"
      />
    </mask>
    <path
      fill="currentColor"
      fill-rule="evenodd"
      d="M22.5 12c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12 6.201 1.5 12 1.5 22.5 6.201 22.5 12M11.926 7.85a1.56 1.56 0 0 0-1.465 1.02.85.85 0 1 1-1.594-.588 3.26 3.26 0 1 1 5.547 3.233l-.019.022-.02.021-1.075 1.105-.006.006-.006.006c-.319.315-.512.534-.512.94v.363a.85.85 0 0 1-1.7 0v-.364c0-1.144.664-1.8 1.003-2.134l.009-.008 1.046-1.076a1.56 1.56 0 0 0-1.208-2.546m0 9.917a.884.884 0 1 0 0-1.767.884.884 0 0 0 0 1.767"
      clip-rule="evenodd"
    />
    <path
      fill="currentColor"
      d="m10.462 8.87 1.595.588zm-1.092.503-.588 1.595zm-.503-1.091-1.595-.589zm5.547 3.233-1.297-1.099zm-.019.022 1.22 1.185.04-.042.038-.044zm-.02.021 1.219 1.186zM13.3 12.663l1.22 1.185zm-.006.006 1.195 1.21.012-.012.012-.013zm-.006.006-1.194-1.21zM12.08 11.48l1.194 1.21zm.009-.008 1.194 1.21.012-.013.013-.012zm1.046-1.076 1.218 1.186.051-.053.046-.056zM12 24.2c6.738 0 12.2-5.462 12.2-12.2h-3.4a8.8 8.8 0 0 1-8.8 8.8zM-.2 12c0 6.738 5.462 12.2 12.2 12.2v-3.4A8.8 8.8 0 0 1 3.2 12zM12-.2C5.262-.2-.2 5.262-.2 12h3.4A8.8 8.8 0 0 1 12 3.2zM24.2 12C24.2 5.262 18.738-.2 12-.2v3.4a8.8 8.8 0 0 1 8.8 8.8zM12.057 9.458a.14.14 0 0 1-.05.065.15.15 0 0 1-.081.027v-3.4a3.26 3.26 0 0 0-3.06 2.132zm-3.275 1.51a2.55 2.55 0 0 0 3.274-1.51l-3.19-1.176a.85.85 0 0 1 1.092-.504zm-1.51-3.275a2.55 2.55 0 0 0 1.51 3.275l1.176-3.19a.85.85 0 0 1 .503 1.092zm4.654-3.243a4.96 4.96 0 0 0-4.654 3.243l3.19 1.177a1.56 1.56 0 0 1 1.464-1.02zm4.96 4.96a4.96 4.96 0 0 0-4.96-4.96v3.4c.861 0 1.56.698 1.56 1.56zm-1.174 3.203a4.95 4.95 0 0 0 1.173-3.203h-3.4c0 .384-.138.734-.368 1.006zm-.019.023.019-.023-2.595-2.197-.02.023zm-.1.108.021-.021-2.437-2.371-.02.021zm-1.074 1.104 1.075-1.104-2.438-2.371-1.074 1.105zm-.006.006.006-.006-2.437-2.37-.006.006zm-.03.031.006-.006-2.389-2.42-.006.007zm-.007-.27a.8.8 0 0 1-.112.382c-.025.04-.039.052-.018.028.023-.026.06-.065.137-.14l-2.389-2.42c-.33.326-1.018.985-1.018 2.15zm0 .363v-.364h-3.4v.364zm-2.55 2.55a2.55 2.55 0 0 0 2.55-2.55h-3.4c0-.47.38-.85.85-.85zm-2.55-2.55a2.55 2.55 0 0 0 2.55 2.55v-3.4c.469 0 .85.38.85.85zm0-.364v.364h3.4v-.364zm1.51-3.344c-.372.366-1.51 1.455-1.51 3.344h3.4c0-.4.19-.621.497-.923zm.008-.009-.009.01 2.388 2.42.009-.01zm1.021-1.05-1.046 1.075 2.438 2.37 1.045-1.074zm-.13.199a.14.14 0 0 1 .033-.09l2.631 2.153a3.25 3.25 0 0 0 .736-2.063zm.14.14a.14.14 0 0 1-.14-.14h3.4c0-1.8-1.46-3.26-3.26-3.26zm-.815 7.334c0-.451.366-.817.817-.817v3.4a2.584 2.584 0 0 0 2.583-2.583zm.817.816a.816.816 0 0 1-.817-.816h3.4a2.584 2.584 0 0 0-2.583-2.584zm.816-.816c0 .45-.366.816-.816.816v-3.4a2.584 2.584 0 0 0-2.584 2.584zm-.816-.817c.45 0 .816.366.816.817h-3.4a2.584 2.584 0 0 0 2.584 2.583z"
      mask="url(#cddaa)"
    />
  </svg>
)

const Navigation = () => {
  const selectNavigation = (menu: MenuType) => {
    setCurrentMenuType(menu)
  }

  createEffect(() => {
    console.log(`currentMenuType`, currentMenuType())
  })

  return (
    <>
      <nav class="fixed bottom-0 bg-base-200 left-0 right-0 z-1030 flex items-center justify-between h-15 p-1 bg-[rgba(247,247,248,0.8)] backdrop-blur-[30px]">
        <a
          class={
            currentMenuType() === MenuType.HOME
              ? 'flex flex-col flex-1 items-center justify-center h-full text-blue-500 no-underline'
              : 'flex flex-col flex-1 items-center justify-center h-full text-black/40 no-underline'
          }
          href="#none"
          onClick={() => selectNavigation(MenuType.HOME)}
        >
          <HomeIcon />
          <span class="text-sm leading-tight m-0 font-normal not-italic transition-colors duration-150">
            Home
          </span>
        </a>

        <a
          class={
            currentMenuType() === MenuType.CONVERSATION
              ? 'flex flex-col flex-1 items-center justify-center h-full text-blue-500 no-underline transition-colors duration-150'
              : 'flex flex-col flex-1 items-center justify-center h-full text-black/40 hover:text-blue-500 no-underline'
          }
          href="#none"
          onClick={() => selectNavigation(MenuType.CONVERSATION)}
        >
          <ConversationIcon />
          <span class="text-sm leading-tight m-0 font-normal not-italic transition-colors duration-150">
            채팅
          </span>
        </a>

        <a
          class={
            currentMenuType() === MenuType.HELP
              ? 'flex flex-col flex-1 items-center justify-center h-full text-blue-500 no-underline transition-colors duration-150'
              : 'flex flex-col flex-1 items-center justify-center h-full text-black/40 no-underline hover:text-blue-500'
          }
          href="#none"
          onClick={() => selectNavigation(MenuType.HELP)}
        >
          <HelpIcon />
          <span class="text-sm leading-tight m-0 font-normal not-italic transition-colors duration-150">
            Help
          </span>
        </a>

        <a
          class={
            currentMenuType() === MenuType.SETTINGS
              ? 'flex flex-col flex-1 items-center justify-center h-full text-blue-500 no-underline transition-colors duration-150'
              : 'flex flex-col flex-1 items-center justify-center h-full text-black/40 no-underline hover:text-blue-500'
          }
          href="#none"
          onClick={() => selectNavigation(MenuType.SETTINGS)}
        >
          <SettingsIcon />
          <span class="text-sm leading-tight m-0 font-normal not-italic transition-colors duration-150">
            설정
          </span>
        </a>
      </nav>
    </>
  )
}

export default Navigation
