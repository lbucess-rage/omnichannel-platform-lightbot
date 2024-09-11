import { MotionStack } from '@/components/MotionStack'
import { Stack, Button, StackProps, Text, ButtonProps } from '@chakra-ui/react'
import { PopupIllustration } from './illustrations/PopupIllustration'

type Props = StackProps & Pick<ButtonProps, 'isDisabled'>

export const PopupMenuButton = (props: Props) => {
  return (
    <MotionStack
      as={Button}
      fontWeight="normal"
      alignItems="center"
      variant="outline"
      colorScheme="gray"
      whiteSpace={'normal'}
      spacing="6"
      height="250px"
      flex="1"
      animate="default"
      whileHover="animateBubbles"
      transition={{ staggerChildren: 0.1 }}
      {...props}
    >
      <PopupIllustration />
      <Stack>
        <Text fontSize="lg" fontWeight="semibold">
          Popup
        </Text>
        <Text textColor="gray.500">사이트 내에 팝업으로 추가</Text>
      </Stack>
    </MotionStack>
  )
}
