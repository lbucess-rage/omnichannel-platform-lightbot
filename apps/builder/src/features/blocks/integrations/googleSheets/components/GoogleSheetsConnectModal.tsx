import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  Text,
  // Image,
  Button,
  ModalFooter,
  Flex,
} from '@chakra-ui/react'
import { useWorkspace } from '@/features/workspace/WorkspaceProvider'
import Link from 'next/link'
import React from 'react'
import { AlertInfo } from '@/components/AlertInfo'
import { GoogleLogo } from '@/components/GoogleLogo'
import { getGoogleSheetsConsentScreenUrlQuery } from '../queries/getGoogleSheetsConsentScreenUrlQuery'

type Props = {
  isOpen: boolean
  typebotId?: string
  blockId?: string
  onClose: () => void
}

export const GoogleSheetConnectModal = ({
  typebotId,
  blockId,
  isOpen,
  onClose,
}: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <GoogleSheetConnectModalContent typebotId={typebotId} blockId={blockId} />
    </Modal>
  )
}

export const GoogleSheetConnectModalContent = ({
  typebotId,
  blockId,
}: {
  typebotId?: string
  blockId?: string
}) => {
  const { workspace } = useWorkspace()

  return (
    <ModalContent>
      <ModalHeader>구글 스프레드 시트 연결연결😃 </ModalHeader>
      <ModalCloseButton />
      <ModalBody as={Stack} spacing="6">
        <Text>
          구글 스프레드 시트와 통합을 진행할려면 모든 권한을 확인해주세요.:
        </Text>
        {/* <Image
          src="/images/google-spreadsheets-scopes.png"
          alt="Google Spreadsheets checkboxes"
          rounded="md"
        /> */}
        <AlertInfo>
          Lightbot은 스프레드시트를 삭제할 수는 없습니다! 😅
        </AlertInfo>
        <Flex>
          {workspace?.id && (
            <Button
              as={Link}
              leftIcon={<GoogleLogo />}
              data-testid="google"
              isLoading={['loading', 'authenticated'].includes(status)}
              variant="outline"
              href={getGoogleSheetsConsentScreenUrlQuery(
                window.location.href,
                workspace.id,
                blockId,
                typebotId
              )}
              mx="auto"
            >
              Continue with Google
            </Button>
          )}
        </Flex>
      </ModalBody>
      <ModalFooter />
    </ModalContent>
  )
}
