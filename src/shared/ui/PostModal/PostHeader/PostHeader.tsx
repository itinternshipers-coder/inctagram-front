'use client'

import s from './PostHeader.module.scss'
import { Author } from '@/features/post/model/type'
import { PersonIcon } from '@/shared/icons/svgComponents'

type PostHeaderProps = {
  author: Author
  actionsMenu: React.ReactNode
}

export const PostHeader = ({ author, actionsMenu }: PostHeaderProps) => (
  <div className={s.postHeader}>
    <div className={s.authorInfo}>
      {author.avatarUrl ? (
        <img src={author.avatarUrl} alt={author.username} className={s.authorAvatar} />
      ) : (
        <PersonIcon className={s.authorAvatar} />
      )}
      <strong>{author.username}</strong>
    </div>
    {actionsMenu}
  </div>
)
