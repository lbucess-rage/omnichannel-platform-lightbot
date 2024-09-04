import { Settings } from '@typebot.io/schemas'
import {
  Stack,
  // FormLabel,
  // Popover,
  // PopoverTrigger,
  // Image,
  // PopoverContent,
  // HStack,
  // Text,
} from '@chakra-ui/react'
import { TextInput } from '@/components/inputs'
import { SwitchWithLabel } from '@/components/inputs/SwitchWithLabel'
import { defaultSettings } from '@typebot.io/schemas/features/typebot/settings/constants'

type Props = {
  workspaceId: string
  typebotId: string
  typebotName: string
  homeUI: Settings['homeUI']
  onHomeUIChange: (homeUI: Settings['homeUI']) => void
}

export const HomeUIForm = ({
  // workspaceId,
  // typebotId,
  // typebotName,
  homeUI,
  onHomeUIChange,
}: Props) => {
  const handleTitleChange = (title: string) =>
    onHomeUIChange({ ...homeUI, title })

  const handleSubTitleChange = (subTitle: string) =>
    onHomeUIChange({ ...homeUI, subTitle })

  const handleCenterNameChange = (centerName: string) =>
    onHomeUIChange({ ...homeUI, centerName })

  const handleIsHomeUIEnabledChange = (isHomeUIEnabled: boolean) =>
    onHomeUIChange({ ...homeUI, isHomeUIEnabled })

  return (
    <Stack spacing="6">
      <SwitchWithLabel
        label="홈 UI/UX 사용여부"
        initialValue={
          homeUI?.isHomeUIEnabled ?? defaultSettings.homeUI.isHomeUIEnabled
        }
        onCheckChange={handleIsHomeUIEnabledChange}
        moreInfoContent="홈 UI/UX를 사용하면 사용자가 챗봇을 처음 시작할 때 보게 될 화면을 설정할 수 있습니다."
      />
      {homeUI?.isHomeUIEnabled && (
        <>
          <Stack>
            <TextInput
              label="초기 인사"
              defaultValue={homeUI?.title}
              onChange={handleTitleChange}
            />
          </Stack>
          <Stack>
            <TextInput
              label="초기 인사 설명"
              defaultValue={homeUI?.subTitle}
              onChange={handleSubTitleChange}
            />
          </Stack>
          <Stack>
            <TextInput
              label="센터명(프로젝트명)"
              defaultValue={homeUI?.centerName}
              onChange={handleCenterNameChange}
            />
          </Stack>
          <Stack>
            <TextInput
              label="센터(프로젝트) ID"
              defaultValue={homeUI?.centerId}
              onChange={(e) => onHomeUIChange({ ...homeUI, centerId: e })}
            />
          </Stack>
          <Stack>
            <TextInput
              label="센터 웹사이트 주소"
              defaultValue={homeUI?.centerUrl}
              onChange={(e) => onHomeUIChange({ ...homeUI, centerUrl: e })}
            />
          </Stack>
        </>
      )}
    </Stack>
  )
}
