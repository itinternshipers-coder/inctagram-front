import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Button } from '../../Button/Button'
import { Edit2OutlineIcon, MoreHorizontalOutlineIcon, TrashOutlineIcon } from '@/shared/icons/svgComponents'
import s from './PostHeader.module.scss'
import { Author } from '../PostModal'

type PostHeaderProps = {
  author: Author
  onEdit: () => void
  onDelete: () => void
}

export const PostHeader = ({ author, onEdit, onDelete }: PostHeaderProps) => (
  <div className={s.postHeader}>
    <div className={s.authorInfo}>
      {author.avatarUrl && <img src={author.avatarUrl} alt={author.username} className={s.authorAvatar} />}
      <strong>{author.username}</strong>
    </div>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button className={s.menuButton} variant="tertiary">
          <MoreHorizontalOutlineIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={s.dropdownContent} sideOffset={0} alignOffset={0} align="end">
          <DropdownMenu.Item className={s.dropdownItem} onSelect={onEdit}>
            <Edit2OutlineIcon /> Edit Post
          </DropdownMenu.Item>
          <DropdownMenu.Item className={s.dropdownItem} onSelect={onDelete}>
            <TrashOutlineIcon /> Delete Post
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  </div>
)
