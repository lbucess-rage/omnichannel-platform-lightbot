import { Match, Switch } from 'solid-js'
import { Menu } from '@ark-ui/solid'
import { FileIcon } from './icons/FileIcon'
import { PictureIcon } from './icons/PictureIcon'
import { isMobile } from '@/utils/isMobileSignal'
import { PaperClipIcon } from './icons/PaperClipIcon'
import clsx from 'clsx'

type Props = {
  onNewFiles: (files: FileList) => void
  class?: string
}

export const TextInputAddFileButton = (props: Props) => {
  return (
    <>
      {/* 모든 파일 형식
        화면에 보이지 않도록 hidden 속성을 가지고 있으며, 파일이 선택되면 onNewFiles 함수를 호출한다.
      */}
      <input
        type="file"
        id="document-upload"
        multiple
        class="hidden"
        onChange={(e) => {
          if (!e.currentTarget.files) return
          props.onNewFiles(e.currentTarget.files)
        }}
      />

      {/* 이미지와 비디오 형식 */}
      <input
        type="file"
        id="photos-upload"
        accept="image/*, video/*"
        multiple
        class="hidden"
        onChange={(e) => {
          if (!e.currentTarget.files) return
          props.onNewFiles(e.currentTarget.files)
        }}
      />

      <Switch>
        {/* 모바일과 데스크탑 구분하여 렌더링 */}
        <Match when={isMobile()}>
          <label
            aria-label="Add attachments"
            for="document-upload"
            class={clsx(
              'filter data-[state=open]:backdrop-brightness-90 hover:backdrop-brightness-95 transition rounded-md p-2 focus:outline-none',
              props.class
            )}
          >
            <PaperClipIcon class="w-5" />
          </label>
        </Match>
        <Match when={true}>
          <Menu.Root>
            <Menu.Trigger
              class={clsx(
                'filter data-[state=open]:backdrop-brightness-90 hover:backdrop-brightness-95 transition rounded-md p-2 focus:outline-none',
                props.class
              )}
              aria-label="Add attachments"
            >
              <PaperClipIcon class="w-5" />
            </Menu.Trigger>
            <Menu.Positioner>
              <Menu.Content class="p-3 gap-2 focus:outline-none">
                <Menu.Item
                  value="document"
                  asChild={(props) => (
                    <label
                      {...props()}
                      for="document-upload"
                      class="p-2 filter hover:brightness-95 flex gap-3 items-center"
                    >
                      <FileIcon class="w-4" /> 문서 첨부
                    </label>
                  )}
                />
                <Menu.Item
                  value="photos"
                  asChild={(props) => (
                    <label
                      {...props()}
                      for="photos-upload"
                      class="p-2 filter hover:brightness-95 flex gap-3 items-center"
                    >
                      <PictureIcon class="w-4" /> 사진 또는 영상 첨부
                    </label>
                  )}
                />
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </Match>
      </Switch>
    </>
  )
}
