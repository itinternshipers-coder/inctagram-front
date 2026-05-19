import { useAuthContext } from '@/features/auth/lib/use-auth-context'
import { useCreateCommentMutation } from '@/entities/comment/api/comments-api'
import { useLikePostMutation, useUnlikePostMutation } from '@/entities/post/api/posts-api'
import { CommentForm } from '@/entities/comment/ui/CommentForm/CommentForm'
import { useState } from 'react'
import s from '../PostModal.module.scss'
import { Button } from '../../Button/Button'
import {
  BookmarkOutlineIcon,
  HeartIcon,
  HeartOutlineIcon,
  PaperPlaneOutlineIcon,
  PersonIcon,
} from '@/shared/icons/svgComponents'
import Image from 'next/image'
import { Author } from '@/features/post/model/type'
import { Typography } from '../../Typography/Typography'
import { Alert } from '../../Alert/Alert'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'

type PostFooterProps = {
  postId: string
  isLikedByMe?: boolean
  likesCount?: number
  handleShare: () => void
  handleAddBookmark: () => void
  author: Author
  displayDate: string
}

const getErrorMessage = (error: unknown) => {
  const apiError = error as FetchBaseQueryError | SerializedError

  if ('status' in apiError) {
    const data = apiError.data as { message?: string; error?: string; detail?: string } | string | undefined

    if (typeof data === 'string') {
      return data
    }

    return data?.message || data?.error || data?.detail || `Error ${apiError.status}`
  }

  return apiError.message || 'Server is not available'
}

export const PostFooter = ({
  postId,
  isLikedByMe = false,
  likesCount = 0,
  handleShare,
  handleAddBookmark,
  author,
  displayDate,
}: PostFooterProps) => {
  const { isLoggedIn, user } = useAuthContext()
  const [createComment] = useCreateCommentMutation()
  const [likePost, { isLoading: isLikingPost }] = useLikePostMutation()
  const [unlikePost, { isLoading: isUnlikingPost }] = useUnlikePostMutation()
  const [errorState, setErrorState] = useState<{ id: number; message: string | null }>({ id: 0, message: null })

  const handleToggleLike = async () => {
    try {
      if (isLikedByMe) {
        await unlikePost({ postId }).unwrap()
      } else {
        await likePost({ postId }).unwrap()
      }
    } catch (error) {
      setErrorState((prev) => ({ id: prev.id + 1, message: getErrorMessage(error) }))
    }
  }

  const handleCreateComment = async (content: string) => {
    try {
      await createComment({
        postId,
        content,
        currentUserId: user?.userId,
        currentUserName: user?.userName,
      }).unwrap()
      setErrorState((prev) => ({ ...prev, message: null }))
    } catch (error) {
      setErrorState((prev) => ({ id: prev.id + 1, message: getErrorMessage(error) }))
      throw error
    }
  }

  return (
    <div className={s.postFooter}>
      {errorState.message && (
        <Alert key={errorState.id} status="error" text={errorState.message} position="bottom-left" autoDismiss={3000} />
      )}
      {isLoggedIn && (
        <div className={s.interactionRow}>
          <div className={s.likesInfo}>
            <Button
              variant="link"
              className={s.iconButton}
              aria-label="Like Post"
              onClick={() => void handleToggleLike()}
              disabled={isLikingPost || isUnlikingPost}
            >
              {isLikedByMe ? <HeartIcon color="var(--danger-500)" /> : <HeartOutlineIcon />}
            </Button>

            <Button onClick={handleShare} variant="link" className={s.iconButton}>
              <PaperPlaneOutlineIcon />
            </Button>
          </div>

          <Button className={s.iconButton} onClick={handleAddBookmark} variant="link">
            <BookmarkOutlineIcon />
          </Button>
        </div>
      )}

      <div className={s.likesInfo}>
        {author.avatarUrl ? (
          <Image src={author.avatarUrl} alt={author.username} className={s.userThumbnail} width={36} height={36} />
        ) : (
          <PersonIcon className={s.authorAvatar} />
        )}
        <div className={s.likesCount}>
          <Typography variant="regular_text_14" as="span">
            {likesCount.toLocaleString('ru-RU')}
          </Typography>{' '}
          <Typography variant="bold_text_14" as="span">{`"Like"`}</Typography>
        </div>
      </div>

      <div className={s.postDate}>{displayDate}</div>
      {isLoggedIn && (
        <div className={s.addCommentSection}>
          <CommentForm onSubmit={handleCreateComment} />
        </div>
      )}
    </div>
  )
}
