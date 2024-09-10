/* eslint-disable no-unused-vars */
import { Popover, PopoverContent, Portal } from '@chakra-ui/react'
import React from 'react'
import { SharePopoverContent } from './SharePopoverContent'
// import { useTranslate } from '@tolgee/react'

export const ShareTypebotButton = () => {
  // const { t } = useTranslate()

  return (
    <Popover isLazy placement="bottom-end">
      {/* <PopoverTrigger>
        <Button
          isLoading={isLoading}
          leftIcon={<UsersIcon />}
          aria-label={t('share.button.popover.ariaLabel')}
          size="sm"
          iconSpacing={{ base: 0, xl: 2 }}
        >
          <chakra.span display={{ base: 'none', xl: 'inline' }}>
            {t('share.button.label')}
          </chakra.span>
        </Button>
      </PopoverTrigger> */}
      <Portal>
        <PopoverContent
          shadow="lg"
          width="430px"
          rootProps={{ style: { transform: 'scale(0)' } }}
        >
          <SharePopoverContent />
        </PopoverContent>
      </Portal>
    </Popover>
  )
}
