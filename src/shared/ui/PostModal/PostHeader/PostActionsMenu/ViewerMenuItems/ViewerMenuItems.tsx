'use client'

import s from '@/shared/ui/PostModal/PostHeader/PostActionsMenu/AuthorMenuItems/AuthorMenuItems.module.scss'
import CopyOutlineIcon from '@/shared/icons/svgComponents/icons/CopyOutlineIcon'
import PersonAddOutlineIcon from '@/shared/icons/svgComponents/icons/PersonAddOutlineIcon'
import PersonRemoveOutlineIcon from '@/shared/icons/svgComponents/icons/PersonRemoveOutlineIcon'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

type Props = {
  onCopy: () => void
  // Платная подписка (если нужна, оставляем)
  onToggleSubscribe?: () => void
  isSubscribed?: boolean
  // Обычная подписка
  isFollowed?: boolean
  onToggleFollow?: () => void
}

export const ViewerMenuItems = ({ onCopy, onToggleSubscribe, isSubscribed, isFollowed, onToggleFollow }: Props) => (
  <>
    {onToggleFollow && (
      <DropdownMenu.Item className={s.dropdownItem} onSelect={onToggleFollow}>
        {isFollowed ? (
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
    )}
    {onToggleSubscribe && (
      <DropdownMenu.Item className={s.dropdownItem} onSelect={onToggleSubscribe}>
        {isSubscribed ? (
          <>
            <PersonRemoveOutlineIcon />
            Unsubscribe
          </>
        ) : (
          <>
            <PersonAddOutlineIcon />
            Subscribe
          </>
        )}
      </DropdownMenu.Item>
    )}
    <DropdownMenu.Item className={s.dropdownItem} onSelect={onCopy}>
      <CopyOutlineIcon /> Copy link
    </DropdownMenu.Item>
  </>
)
