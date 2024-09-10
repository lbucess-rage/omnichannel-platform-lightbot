import { HStack, Stack, Text } from '@chakra-ui/react'
import { Settings } from '@typebot.io/schemas'
import React from 'react'
import { NumberInput } from '@/components/inputs'
import { SwitchWithLabel } from '@/components/inputs/SwitchWithLabel'
import { defaultSettings } from '@typebot.io/schemas/features/typebot/settings/constants'
import { SwitchWithRelatedSettings } from '@/components/SwitchWithRelatedSettings'
import { isDefined } from '@typebot.io/lib'

type Props = {
  typingEmulation: Settings['typingEmulation']
  onUpdate: (typingEmulation: Settings['typingEmulation']) => void
}

export const TypingEmulationForm = ({ typingEmulation, onUpdate }: Props) => {
  const updateIsEnabled = (enabled: boolean) =>
    onUpdate({
      ...typingEmulation,
      enabled,
    })

  const updateSpeed = (speed?: number) =>
    onUpdate({ ...typingEmulation, speed })

  const updateMaxDelay = (maxDelay?: number) =>
    onUpdate({
      ...typingEmulation,
      maxDelay: isDefined(maxDelay)
        ? Math.max(Math.min(maxDelay, 5), 0)
        : undefined,
    })

  const updateIsDisabledOnFirstMessage = (isDisabledOnFirstMessage: boolean) =>
    onUpdate({
      ...typingEmulation,
      isDisabledOnFirstMessage,
    })

  const updateDelayBetweenBubbles = (delayBetweenBubbles?: number) =>
    onUpdate({ ...typingEmulation, delayBetweenBubbles })

  return (
    <Stack spacing={6}>
      <SwitchWithRelatedSettings
        label={'타이핑 효과 활성화'}
        initialValue={
          typingEmulation?.enabled ?? defaultSettings.typingEmulation.enabled
        }
        onCheckChange={updateIsEnabled}
      >
        <NumberInput
          label="분당 글자 수(스피드):"
          data-testid="speed"
          defaultValue={
            typingEmulation?.speed ?? defaultSettings.typingEmulation.speed
          }
          onValueChange={updateSpeed}
          withVariableButton={false}
          maxW="100px"
          step={30}
          direction="row"
        />
        <HStack>
          <NumberInput
            label="최대 지연설정:"
            data-testid="max-delay"
            defaultValue={
              typingEmulation?.maxDelay ??
              defaultSettings.typingEmulation.maxDelay
            }
            onValueChange={updateMaxDelay}
            withVariableButton={false}
            maxW="100px"
            step={0.1}
            direction="row"
            size="sm"
          />
          <Text>초</Text>
        </HStack>

        <SwitchWithLabel
          label={'첫 번째 메시지에서 비활성화'}
          moreInfoContent="이 옵션을 선택하면 첫 번째 메시지에서 타이핑 효과를 비활성화합니다."
          onCheckChange={updateIsDisabledOnFirstMessage}
          initialValue={
            typingEmulation?.isDisabledOnFirstMessage ??
            defaultSettings.typingEmulation.isDisabledOnFirstMessage
          }
        />
      </SwitchWithRelatedSettings>
      <HStack>
        <NumberInput
          label="메세지 간격 지연설정:"
          defaultValue={
            typingEmulation?.delayBetweenBubbles ??
            defaultSettings.typingEmulation.delayBetweenBubbles
          }
          withVariableButton={false}
          onValueChange={updateDelayBetweenBubbles}
          direction="row"
          maxW={'100px'}
          min={0}
          max={5}
          size="sm"
        />
        <Text>초</Text>
      </HStack>
    </Stack>
  )
}
