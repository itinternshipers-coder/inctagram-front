'use client'

import { useFollowUserMutation, useUnfollowUserMutation } from '@/features/following/api/following-api'
import type { FollowsListItem as FollowsListItemType } from '@/features/following/model/types'
import { ROUTES } from '@/shared/config/routes'
import { Button } from '@/shared/ui/Button/Button'
import { Typography } from '@/shared/ui/Typography/Typography'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import s from './FollowsListItem.module.scss'

type Props = {
  item: FollowsListItemType
  currentUserId?: string
  initialIsFollowed: boolean
  hideAction?: boolean
  showDelete?: boolean
}

export const FollowsListItem = ({ item, currentUserId, initialIsFollowed, hideAction, showDelete }: Props) => {
  const [isFollowed, setIsFollowed] = useState(initialIsFollowed)
  const [followUser, { isLoading: isFollowing }] = useFollowUserMutation()
  const [unfollowUser, { isLoading: isUnfollowing }] = useUnfollowUserMutation()

  const isPending = isFollowing || isUnfollowing

  const handleToggle = async () => {
    const wasFollowed = isFollowed
    setIsFollowed(!wasFollowed)

    try {
      if (wasFollowed) {
        await unfollowUser({ userId: item.id, currentUserId }).unwrap()
      } else {
        await followUser({ userId: item.id, currentUserId }).unwrap()
      }
    } catch {
      setIsFollowed(wasFollowed)
    }
  }

  // эндпоинт «удалить подписчика» отсутствует в swagger.
  const handleDelete = () => {}

  return (
    <li className={s.item}>
      <Link href={ROUTES.DYNAMIC.PROFILE(item.id)} className={s.link}>
        {item.avatarUrl ? (
          <Image src={item.avatarUrl} alt={item.username} width={48} height={48} className={s.avatar} />
        ) : (
          <div className={s.avatarPlaceholder} aria-hidden>
            {item.username.charAt(0).toUpperCase()}
          </div>
        )}
        <Typography variant="bold_text_16" as="span" className={s.username}>
          {item.username}
        </Typography>
      </Link>

      <div className={s.actions}>
        {!hideAction && (
          <Button
            variant={isFollowed ? 'tertiary' : 'primary'}
            onClick={handleToggle}
            disabled={isPending}
            className={s.followBtn}
          >
            {isFollowed ? 'Unfollow' : 'Follow'}
          </Button>
        )}
        {showDelete && (
          <Button variant="link" onClick={handleDelete} className={s.deleteBtn}>
            Delete
          </Button>
        )}
      </div>
    </li>
  )
}
