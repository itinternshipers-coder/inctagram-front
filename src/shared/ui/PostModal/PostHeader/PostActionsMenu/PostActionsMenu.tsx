'use client'
import s from './PostActionsMenu.module.scss'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Button } from '../../../Button/Button'
import { MoreHorizontalOutlineIcon } from '@/shared/icons/svgComponents'

export const PostActionsMenu = ({ children }: { children: React.ReactNode }) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild>
      <Button className={s.menuButton} variant="tertiary">
        <MoreHorizontalOutlineIcon />
      </Button>
    </DropdownMenu.Trigger>

    <DropdownMenu.Portal>
      <DropdownMenu.Content className={s.dropdownContent} sideOffset={0} alignOffset={0} align="end">
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
)
