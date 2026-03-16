'use client'
import s from '@/shared/ui/PostModal/PostHeader/PostActionsMenu/AuthorMenuItems/AuthorMenuItems.module.scss'
import { CopyOutlineIcon, PersonAddOutlineIcon, PersonRemoveOutlineIcon } from '@inctagram/ui'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

type Props = {
  onCopy: () => void
  onToggleSubscribe: () => void
  isSubscribed: boolean
}

export const ViewerMenuItems = ({ onCopy, onToggleSubscribe, isSubscribed }: Props) => (
  <>
    <DropdownMenu.Item className={s.dropdownItem} onSelect={onToggleSubscribe}>
      {isSubscribed ? (
        <>
          <PersonRemoveOutlineIcon />
          Unfollow
        </>
      ) : (
        <>
          <PersonAddOutlineIcon />
          Follow
        </>
      )}
    </DropdownMenu.Item>
    <DropdownMenu.Item className={s.dropdownItem} onSelect={onCopy}>
      <CopyOutlineIcon /> Copy link
    </DropdownMenu.Item>
  </>
)
