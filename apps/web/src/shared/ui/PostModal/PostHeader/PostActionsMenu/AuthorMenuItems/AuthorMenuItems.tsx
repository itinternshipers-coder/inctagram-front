'use client'
import s from './AuthorMenuItems.module.scss'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Edit2OutlineIcon, TrashOutlineIcon } from '@inctagram/ui'

type Props = {
  onEdit: () => void
  onDelete: () => void
}

export const AuthorMenuItems = ({ onEdit, onDelete }: Props) => (
  <>
    <DropdownMenu.Item className={s.dropdownItem} onSelect={onEdit}>
      <Edit2OutlineIcon /> Edit Post
    </DropdownMenu.Item>
    <DropdownMenu.Item className={s.dropdownItem} onSelect={onDelete}>
      <TrashOutlineIcon /> Delete Post
    </DropdownMenu.Item>
  </>
)
