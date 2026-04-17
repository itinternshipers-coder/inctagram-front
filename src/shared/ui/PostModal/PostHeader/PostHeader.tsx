'use client'

import s from './PostHeader.module.scss'
import { Author } from '@/features/post/model/type'
import { PersonIcon } from '@/shared/icons/svgComponents'
import Image from 'next/image'

type PostHeaderProps = {
  author: Author
  actionsMenu: React.ReactNode
}

export const PostHeader = ({ author, actionsMenu }: PostHeaderProps) => (
  <div className={s.postHeader}>
    <div className={s.authorInfo}>
      {author.avatarUrl ? (
        <Image src={author.avatarUrl} alt={author.username} className={s.authorAvatar} width={36} height={36} />
      ) : (
        <PersonIcon className={s.authorAvatar} />
      )}
      <strong>{author.username}</strong>
    </div>
    {actionsMenu}
  </div>
)
