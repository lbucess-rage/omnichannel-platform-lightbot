import { Textarea, ShortTextInput } from '@/components'
import { SendButton } from '@/components/SendButton'
import { CommandData } from '@/features/commands'
import { Answer, BotContext, InputSubmitContent } from '@/types'
import { isMobile } from '@/utils/isMobileSignal'
import type { TextInputBlock } from '@typebot.io/schemas'
import { For, Show, createSignal, onCleanup, onMount } from 'solid-js'
import { defaultTextInputOptions } from '@typebot.io/schemas/features/blocks/inputs/text/constants'
import clsx from 'clsx'
import { TextInputAddFileButton } from '@/components/TextInputAddFileButton'
import { SelectedFile } from '../../fileUpload/components/SelectedFile'
import { sanitizeNewFile } from '../../fileUpload/helpers/sanitizeSelectedFiles'
import { getRuntimeVariable } from '@typebot.io/env/getRuntimeVariable'
import { toaster } from '@/utils/toaster'
import { isDefined } from '@typebot.io/lib'
import { uploadFiles } from '../../fileUpload/helpers/uploadFiles'
import { guessApiHost } from '@/utils/guessApiHost'

type Props = {
  block: TextInputBlock
  defaultValue?: string
  context: BotContext
  onSubmit: (value: InputSubmitContent) => void
}

export const TextInput = (props: Props) => {
  // 현재 입력된 텍스트 값을 저장
  const [inputValue, setInputValue] = createSignal(props.defaultValue ?? '')

  // 선택된 파일을 저장
  const [selectedFiles, setSelectedFiles] = createSignal<File[]>([])

  // 파일 업로드 진행률을 저장
  const [uploadProgress, setUploadProgress] = createSignal<
    { fileIndex: number; progress: number } | undefined
  >(undefined)

  // 파일 드래그 오버 상태를 저장
  const [isDraggingOver, setIsDraggingOver] = createSignal(false)

  // 입력필드의 참조를 저장
  let inputRef: HTMLInputElement | HTMLTextAreaElement | undefined

  // 입력값이 변경될 때 inputValue를 업데이트
  const handleInput = (inputValue: string) => setInputValue(inputValue)

  // 입력값이 유효한지 확인
  const checkIfInputIsValid = () =>
    inputRef?.value !== '' && inputRef?.reportValidity()

  /**
   *   입력값과 파일을 submit 처리
   *  1. 파일이 있으면 uploadFiles를 통해 파일 업로드
   *  2. 제출 후 onSubmit 호출
   *  파일이 없으면 onSubmit 호출
   */
  const submit = async () => {
    // 입력값이 유효한지 확인
    if (checkIfInputIsValid()) {
      let attachments: Answer['attachments']

      // 파일이 선택되어 있으면
      if (selectedFiles().length > 0) {
        // 업로드 상태 초기화
        setUploadProgress(undefined)

        console.log('uploadFiles 호출')
        // uploadFiles 호출하여 파일 업로드
        const urls = await uploadFiles({
          // viewer의 apiHost를 가져오거나, apiHost를 추측하여 사용
          apiHost:
            props.context.apiHost ?? guessApiHost({ ignoreChatApiUrl: true }),
          files: selectedFiles().map((file) => ({
            file: file,

            // 세션아이디와 파일이름을 전달
            input: {
              sessionId: props.context.sessionId,
              fileName: file.name,
            },
          })),

          // 업로드 진행률 setter 전달
          onUploadProgress: setUploadProgress,
        })

        // urls가 존재하면 attachments에 저장
        attachments = urls?.filter(isDefined)
      }

      console.log(
        `onSubmit input value, attachments`,
        inputRef?.value ?? inputValue(),
        attachments
      )
      // 입력값과 attachments를 전달하여 onSubmit 호출
      props.onSubmit({
        value: inputRef?.value ?? inputValue(),
        attachments,
      })
    } else inputRef?.focus()
  }

  // Enter 키 입력시 제출
  const submitWhenEnter = (e: KeyboardEvent) => {
    if (props.block.options?.isLong) return
    if (e.key === 'Enter') submit()
  }

  // Ctrl + Enter 입력시 제출
  const submitIfCtrlEnter = (e: KeyboardEvent) => {
    if (!props.block.options?.isLong) return
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
  }

  // 마운트 시 이벤트 리스너 등록
  onMount(() => {
    // 모바일이 아니고 inputRef가 존재하면 focus
    if (!isMobile() && inputRef)
      // preventScroll: true로 스크롤 방지
      inputRef.focus({
        preventScroll: true,
      })

    //
    window.addEventListener('message', processIncomingEvent)
  })

  // 언마운트 시 이벤트 리스너 제거
  onCleanup(() => {
    window.removeEventListener('message', processIncomingEvent)
  })

  // 외부 메시지을 받아 처리
  // setInputValue를 통해 입력값을 업데이트
  const processIncomingEvent = (event: MessageEvent<CommandData>) => {
    const { data } = event
    if (!data.isFromTypebot) return
    if (data.command === 'setInputValue') setInputValue(data.value)
  }

  // 드래그 상태일 때 상태 업데이트
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(true)
  }

  // 드래그 상태 해제
  const handleDragLeave = () => setIsDraggingOver(false)

  // 파일 드롭 이벤트 처리
  const handleDropFile = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!e.dataTransfer?.files) return
    onNewFiles(e.dataTransfer.files)
  }

  const onNewFiles = (files: FileList) => {
    const newFiles = Array.from(files)
      .map((file) =>
        sanitizeNewFile({
          existingFiles: selectedFiles(),
          newFile: file,
          params: {
            sizeLimit: getRuntimeVariable(
              'NEXT_PUBLIC_BOT_FILE_UPLOAD_MAX_SIZE'
            ),
          },
          onError: ({ description, title }) => {
            toaster.create({
              description,
              title,
            })
          },
        })
      )
      .filter(isDefined)

    if (newFiles.length === 0) return

    setSelectedFiles((selectedFiles) => [...newFiles, ...selectedFiles])
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((selectedFiles) =>
      selectedFiles.filter((_, i) => i !== index)
    )
  }

  return (
    <div
      class={clsx(
        'typebot-input-form flex w-full gap-2 items-end',
        props.block.options?.isLong ? 'max-w-full' : 'max-w-[350px]'
      )}
      onKeyDown={submitWhenEnter}
      onDrop={handleDropFile}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div
        class={clsx(
          'typebot-input flex-col w-full',
          isDraggingOver() && 'filter brightness-95'
        )}
      >
        <Show when={selectedFiles().length}>
          <div
            class="p-2 flex gap-2 border-gray-100 overflow-auto"
            style={{ 'border-bottom-width': '1px' }}
          >
            <For each={selectedFiles()}>
              {(file, index) => (
                <SelectedFile
                  file={file}
                  uploadProgressPercent={
                    uploadProgress()
                      ? uploadProgress()?.fileIndex === index()
                        ? 20
                        : index() < (uploadProgress()?.fileIndex ?? 0)
                        ? 100
                        : 0
                      : undefined
                  }
                  onRemoveClick={() => removeSelectedFile(index())}
                />
              )}
            </For>
          </div>
        </Show>
        <div
          class={clsx(
            'flex justify-between px-2',
            props.block.options?.isLong ? 'items-end' : 'items-center'
          )}
        >
          {props.block.options?.isLong ? (
            <Textarea
              ref={inputRef as HTMLTextAreaElement}
              onInput={handleInput}
              onKeyDown={submitIfCtrlEnter}
              value={inputValue()}
              placeholder={
                props.block.options?.labels?.placeholder ??
                defaultTextInputOptions.labels.placeholder
              }
            />
          ) : (
            <ShortTextInput
              ref={inputRef as HTMLInputElement}
              onInput={handleInput}
              value={inputValue()}
              placeholder={
                props.block.options?.labels?.placeholder ??
                defaultTextInputOptions.labels.placeholder
              }
            />
          )}
          <Show
            when={
              (props.block.options?.attachments?.isEnabled ??
                defaultTextInputOptions.attachments.isEnabled) &&
              props.block.options?.attachments?.saveVariableId
            }
          >
            <TextInputAddFileButton
              onNewFiles={onNewFiles}
              class={clsx(props.block.options?.isLong ? 'ml-2' : undefined)}
            />
          </Show>
        </div>
      </div>

      <SendButton
        type="button"
        on:click={submit}
        isDisabled={Boolean(uploadProgress())}
        class="h-[56px]"
      >
        {props.block.options?.labels?.button}
      </SendButton>
    </div>
  )
}
