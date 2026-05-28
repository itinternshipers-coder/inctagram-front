'use client'

import { ViewerMenuItems } from '@/shared/ui/PostModal/PostHeader/PostActionsMenu/ViewerMenuItems/ViewerMenuItems'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/shared/config/routes'
import { Post } from '@/entities/post/model'
import { useAuthContext } from '@/features/auth/lib/use-auth-context'
import { useLikePostMutation, useUnlikePostMutation } from '@/entities/post/api/posts-api'
import { useFollowUserMutation, useUnfollowUserMutation } from '@/features/following/api/following-api'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { setFollowed, setUnfollowed } from '@/features/following/model/following-slice'
import { PostActionsMenu } from '@/shared/ui/PostModal/PostHeader/PostActionsMenu/PostActionsMenu'
import {
  HeartIcon,
  HeartOutlineIcon,
  MessageCircleOutlineIcon,
  PaperPlaneOutlineIcon,
} from '@/shared/icons/svgComponents'
import { formatTimeAgo } from '@/shared/lib/formatTimeAgo'
import { Alert } from '@/shared/ui/Alert/Alert'
import { useState } from 'react'
import s from './FeedPostCard.module.scss'

type Props = { post: Post }

export const FeedPostCard = ({ post }: Props) => {
  const { user, isLoggedIn } = useAuthContext()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [likePost] = useLikePostMutation()
  const [unlikePost] = useUnlikePostMutation()
  const [followUser] = useFollowUserMutation()
  const [unfollowUser] = useUnfollowUserMutation()
  const [error, setError] = useState<string | null>(null)

  const isOwner = user?.userId === post.authorId
  const isFollowed = useAppSelector((state) => state.following.followStatus[post.authorId]) ?? false
  const recentLikers = post.recentLikers?.slice(0, 3) || []
  const displayDate = formatTimeAgo(post.createdAt, 'en')
  const firstPhoto = post.photos?.[0]

  const handleLike = async () => {
    if (!isLoggedIn) return
    try {
      if (post.isLikedByMe) {
        await unlikePost({ postId: post.id }).unwrap()
      } else {
        await likePost({ postId: post.id }).unwrap()
      }
    } catch {
      setError('Failed to update like')
    }
  }

  const handleFollowToggle = async () => {
    if (!user?.userId) return
    try {
      if (isFollowed) {
        await unfollowUser({ userId: post.authorId, currentUserId: user.userId }).unwrap()
        dispatch(setUnfollowed({ userId: post.authorId }))
      } else {
        await followUser({ userId: post.authorId, currentUserId: user.userId }).unwrap()
        dispatch(setFollowed({ userId: post.authorId }))
      }
    } catch {
      setError('Failed to update follow status')
    }
  }

  const handlePostClick = () => router.push(ROUTES.MODALS.POST(post.id), { scroll: false })
  const handleSendMessage = () => router.push(`${ROUTES.PROTECTED.MESSENGER}?recipientId=${post.authorId}`)

  return (
    <article className={s.card}>
      {error && <Alert status="error" text={error} position="bottom-left" autoDismiss={3000} />}
      <div className={s.header}>
        <Link href={ROUTES.DYNAMIC.PROFILE(post.authorId)} className={s.authorInfo}>
          {post.authorAvatarUrl ? (
            <Image
              src={post.authorAvatarUrl}
              alt={post.userName || 'User'}
              width={36}
              height={36}
              className={s.avatar}
            />
          ) : (
            <div className={s.avatarPlaceholder} />
          )}
          <strong>{post.userName || 'User'}</strong>
        </Link>
        {isLoggedIn && !isOwner && (
          <PostActionsMenu>
            <ViewerMenuItems
              onCopy={() => navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`)}
              isFollowed={isFollowed}
              onToggleFollow={handleFollowToggle}
            />
          </PostActionsMenu>
        )}
      </div>

      <div onClick={handlePostClick} className={s.imageWrapper}>
        {firstPhoto ? (
          <Image src={firstPhoto.url} alt="Post" fill className={s.image} />
        ) : (
          <div className={s.noImage}>No media</div>
        )}
      </div>

      {isLoggedIn && (
        <div className={s.actions}>
          <button onClick={handleLike} className={s.actionBtn}>
            {post.isLikedByMe ? <HeartIcon color="var(--danger-500)" /> : <HeartOutlineIcon />}
          </button>
          <button onClick={handlePostClick} className={s.actionBtn}>
            <MessageCircleOutlineIcon />
          </button>
          <button onClick={handleSendMessage} className={s.actionBtn}>
            <PaperPlaneOutlineIcon />
          </button>
        </div>
      )}

      <div className={s.likesSection}>
        {recentLikers.length > 0 && (
          <div className={s.likers}>
            {recentLikers.map((liker) => (
              <Image
                key={liker.userId}
                src={liker.avatarUrl || '/default-avatar.png'}
                alt={liker.userName}
                width={24}
                height={24}
                className={s.likerAvatar}
              />
            ))}
          </div>
        )}
        <span className={s.likesCount}>{post.likesCount ?? 0} likes</span>
      </div>

      {post.description && (
        <div className={s.description}>
          <strong>{post.userName}</strong> {post.description}
        </div>
      )}

      {(post.commentsCount ?? 0) > 0 && (
        <button onClick={handlePostClick} className={s.commentsLink}>
          View all {post.commentsCount} comments
        </button>
      )}

      <div className={s.date}>{displayDate}</div>
    </article>
  )
}
