import type {
  ContinueChatResponse,
  ChoiceInputBlock,
  EmailInputBlock,
  FileInputBlock,
  NumberInputBlock,
  PhoneNumberInputBlock,
  RatingInputBlock,
  RuntimeOptions,
  TextInputBlock,
  Theme,
  UrlInputBlock,
  PictureChoiceBlock,
  PaymentInputBlock,
  DateInputBlock,
} from '@typebot.io/schemas'
import { GuestBubble } from './bubbles/GuestBubble'
import { Answer, BotContext, InputSubmitContent } from '@/types'
import { TextInput } from '@/features/blocks/inputs/textInput'
import { NumberInput } from '@/features/blocks/inputs/number'
import { EmailInput } from '@/features/blocks/inputs/email'
import { UrlInput } from '@/features/blocks/inputs/url'
import { PhoneInput } from '@/features/blocks/inputs/phone'
import { DateForm } from '@/features/blocks/inputs/date'
import { RatingForm } from '@/features/blocks/inputs/rating'
import { FileUploadForm } from '@/features/blocks/inputs/fileUpload'
import { createSignal, Switch, Match, createEffect, Show } from 'solid-js'
import { isNotDefined } from '@typebot.io/lib'
import { isMobile } from '@/utils/isMobileSignal'
import { PaymentForm } from '@/features/blocks/inputs/payment'
import { MultipleChoicesForm } from '@/features/blocks/inputs/buttons/components/MultipleChoicesForm'
import { Buttons } from '@/features/blocks/inputs/buttons/components/Buttons'
import { SinglePictureChoice } from '@/features/blocks/inputs/pictureChoice/SinglePictureChoice'
import { MultiplePictureChoice } from '@/features/blocks/inputs/pictureChoice/MultiplePictureChoice'
import { formattedMessages } from '@/utils/formattedMessagesSignal'
import { InputBlockType } from '@typebot.io/schemas/features/blocks/inputs/constants'
import { defaultPaymentInputOptions } from '@typebot.io/schemas/features/blocks/inputs/payment/constants'
import { persist } from '@/utils/persist'
import { defaultGuestAvatarIsEnabled } from '@typebot.io/schemas/features/typebot/theme/constants'

type Props = {
  ref: HTMLDivElement | undefined
  block: NonNullable<ContinueChatResponse['input']>
  hasHostAvatar: boolean
  guestAvatar?: NonNullable<Theme['chat']>['guestAvatar']
  chunkIndex: number
  context: BotContext
  isInputPrefillEnabled: boolean
  hasError: boolean
  onTransitionEnd: () => void
  onSubmit: (answer: string, attachments?: Answer['attachments']) => void
  onSkip: () => void
}

export const InputChatBlock = (props: Props) => {
  console.log(`InputChatBlock props`, props)

  // 입력 값과 관련된 상태를 관리하는 Signal 생성
  const [answer, setAnswer] = persist(createSignal<Answer>(), {
    key: `lightbot-${props.context.typebot.id}-input-${props.chunkIndex}`,
    storage: props.context.storage,
  })

  // 입력값을 제출하는 함수
  const handleSubmit = async ({
    label,
    value,
    attachments,
  }: InputSubmitContent & Pick<Answer, 'attachments'>) => {
    setAnswer({
      text: props.block.type !== InputBlockType.FILE ? label ?? value : '',
      attachments,
    })
    props.onSubmit(
      value ?? label,
      props.block.type === InputBlockType.FILE ? undefined : attachments
    )
  }

  const handleSkip = (label: string) => {
    setAnswer({ text: label })
    props.onSkip()
  }

  createEffect(() => {
    const formattedMessage = formattedMessages().findLast(
      (message) => props.chunkIndex === message.inputIndex
    )?.formattedMessage
    if (formattedMessage && props.block.type !== InputBlockType.FILE)
      setAnswer((answer) => ({ ...answer, text: formattedMessage }))
  })

  return (
    <Switch>
      {/* 응답 내용이 있고 에러 상태가 아닌 경우 , 사용자의 입력한 값이나 파일(이미지 등)을 렌더링  */}
      <Match when={answer() && !props.hasError}>
        <GuestBubble
          message={answer() as Answer}
          showAvatar={
            props.guestAvatar?.isEnabled ?? defaultGuestAvatarIsEnabled
          }
          avatarSrc={props.guestAvatar?.url && props.guestAvatar.url}
          hasHostAvatar={props.hasHostAvatar}
        />
      </Match>

      {/* 응답 내용이 없거나 에러가 있는 경우 Input 컴포넌트 렌더링  */}
      <Match when={isNotDefined(answer()) || props.hasError}>
        <div
          class="flex justify-end animate-fade-in gap-2 typebot-input-container"
          data-blockid={props.block.id}
          ref={props.ref}
        >
          <Show when={props.hasHostAvatar}>
            <div
              class={
                'flex flex-shrink-0 items-center ' +
                (isMobile() ? 'w-6 h-6' : 'w-10 h-10')
              }
            />
          </Show>
          <Input
            context={props.context}
            block={props.block}
            chunkIndex={props.chunkIndex}
            isInputPrefillEnabled={props.isInputPrefillEnabled}
            existingAnswer={props.hasError ? answer()?.text : undefined}
            onTransitionEnd={props.onTransitionEnd}
            onSubmit={handleSubmit}
            onSkip={handleSkip}
          />
        </div>
      </Match>
    </Switch>
  )
}

// 사용자가 입력한 데이터를 받아들이고, 다양한 입력 블록 유형에 맞는 UI를 렌더링
// props을 통해 전달된 'props.block.type'에 따라 다양한 입력 블록 유형에 맞는 UI를 렌더링
const Input = (props: {
  // 챗봇의 컨텍스트 전달
  context: BotContext
  // 현재 렌더링할 입력 블록의 데이터
  block: NonNullable<ContinueChatResponse['input']>

  // 현재 입력 블록이 속한 청크의 인덱스
  chunkIndex: number

  // 입력값을 미리 채워넣을지 여부
  isInputPrefillEnabled: boolean

  // 기존에 사용자가 입력한 값
  existingAnswer?: string

  // 입력 블록의 전환 애니메이션 종료시 호출되는 함수
  onTransitionEnd: () => void

  // 사용자가 입력한 값을 전달하는 함수
  onSubmit: (answer: InputSubmitContent) => void

  // 사용자가 입력을 건너뛸 때 호출되는 함수
  onSkip: (label: string) => void
}) => {
  // 사용자가 입력한 값을 상위 컴포넌트로 전달하는 함수
  const onSubmit = (answer: InputSubmitContent) => props.onSubmit(answer)

  // 입력 블록의 미리 채워진 값을 반환하는 함수
  const getPrefilledValue = () =>
    props.existingAnswer ??
    (props.isInputPrefillEnabled ? props.block.prefilledValue : undefined)

  // 결제 입력 블록이 성공시 호출되는 함수
  const submitPaymentSuccess = () =>
    props.onSubmit({
      value:
        (props.block.options as PaymentInputBlock['options'])?.labels
          ?.success ?? defaultPaymentInputOptions.labels.success,
    })

  return (
    <Switch>
      <Match when={props.block.type === InputBlockType.TEXT}>
        <TextInput
          block={props.block as TextInputBlock}
          defaultValue={getPrefilledValue()}
          context={props.context}
          onSubmit={onSubmit}
        />
      </Match>
      <Match when={props.block.type === InputBlockType.NUMBER}>
        <NumberInput
          block={props.block as NumberInputBlock}
          defaultValue={getPrefilledValue()}
          onSubmit={onSubmit}
        />
      </Match>
      <Match when={props.block.type === InputBlockType.EMAIL}>
        <EmailInput
          block={props.block as EmailInputBlock}
          defaultValue={getPrefilledValue()}
          onSubmit={onSubmit}
        />
      </Match>
      <Match when={props.block.type === InputBlockType.URL}>
        <UrlInput
          block={props.block as UrlInputBlock}
          defaultValue={getPrefilledValue()}
          onSubmit={onSubmit}
        />
      </Match>
      <Match when={props.block.type === InputBlockType.PHONE}>
        <PhoneInput
          labels={(props.block as PhoneNumberInputBlock).options?.labels}
          defaultCountryCode={
            (props.block as PhoneNumberInputBlock).options?.defaultCountryCode
          }
          defaultValue={getPrefilledValue()}
          onSubmit={onSubmit}
        />
      </Match>
      <Match when={props.block.type === InputBlockType.DATE}>
        <DateForm
          options={props.block.options as DateInputBlock['options']}
          defaultValue={getPrefilledValue()}
          onSubmit={onSubmit}
        />
      </Match>
      <Match when={isButtonsBlock(props.block)} keyed>
        {(block) => (
          <Switch>
            <Match when={!block.options?.isMultipleChoice}>
              <Buttons
                chunkIndex={props.chunkIndex}
                defaultItems={block.items}
                options={block.options}
                onSubmit={onSubmit}
              />
            </Match>
            <Match when={block.options?.isMultipleChoice}>
              <MultipleChoicesForm
                defaultItems={block.items}
                options={block.options}
                onSubmit={onSubmit}
              />
            </Match>
          </Switch>
        )}
      </Match>
      <Match when={isPictureChoiceBlock(props.block)} keyed>
        {(block) => (
          <Switch>
            <Match when={!block.options?.isMultipleChoice}>
              <SinglePictureChoice
                defaultItems={block.items}
                options={block.options}
                onSubmit={onSubmit}
                onTransitionEnd={props.onTransitionEnd}
              />
            </Match>
            <Match when={block.options?.isMultipleChoice}>
              <MultiplePictureChoice
                defaultItems={block.items}
                options={block.options}
                onSubmit={onSubmit}
                onTransitionEnd={props.onTransitionEnd}
              />
            </Match>
          </Switch>
        )}
      </Match>
      <Match when={props.block.type === InputBlockType.RATING}>
        <RatingForm
          block={props.block as RatingInputBlock}
          defaultValue={getPrefilledValue()}
          onSubmit={onSubmit}
        />
      </Match>
      <Match when={props.block.type === InputBlockType.FILE}>
        <FileUploadForm
          context={props.context}
          block={props.block as FileInputBlock}
          onSubmit={onSubmit}
          onSkip={props.onSkip}
        />
      </Match>
      <Match when={props.block.type === InputBlockType.PAYMENT}>
        <PaymentForm
          context={props.context}
          options={
            {
              ...props.block.options,
              ...props.block.runtimeOptions,
            } as PaymentInputBlock['options'] & RuntimeOptions
          }
          onSuccess={submitPaymentSuccess}
          onTransitionEnd={props.onTransitionEnd}
        />
      </Match>
    </Switch>
  )
}

const isButtonsBlock = (
  block: ContinueChatResponse['input']
): ChoiceInputBlock | undefined =>
  block?.type === InputBlockType.CHOICE ? block : undefined

const isPictureChoiceBlock = (
  block: ContinueChatResponse['input']
): PictureChoiceBlock | undefined =>
  block?.type === InputBlockType.PICTURE_CHOICE ? block : undefined
