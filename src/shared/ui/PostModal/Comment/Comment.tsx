import { useAuthContext } from '@/features/auth/lib/use-auth-context'
import {
  useCreateReplyMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
} from '@/entities/comment/api/comments-api'
import { CommentForm } from '@/entities/comment/ui/CommentForm/CommentForm'
import { useState } from 'react'
import s from './Comment.module.scss'
import { HeartIcon, HeartOutlineIcon, PersonIcon } from '@/shared/icons/svgComponents'
import Image from 'next/image'
import { Button } from '../../Button/Button'
import { Alert } from '../../Alert/Alert'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'

type CommentUser = {
  id: string
  username: string
  avatarUrl: string | null
}

export type CommentViewModel = {
  id: string
  postId: string
  user: CommentUser
  text: string
  time: string
  likesCount: number
  isLikedByMe: boolean
  replies?: CommentViewModel[]
}

type CommentProps = CommentViewModel & {
  canReply?: boolean
  canLike?: boolean
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

const flattenReplies = (replies?: CommentViewModel[]): CommentViewModel[] => {
  if (!replies) return []

  let flat: CommentViewModel[] = []

  replies.forEach((reply) => {
    flat.push({ ...reply })
    if (reply.replies?.length) {
      flat = flat.concat(flattenReplies(reply.replies))
    }
  })

  return flat
}

export const Comment = ({
  id,
  postId,
  user,
  text,
  time,
  likesCount,
  isLikedByMe,
  replies,
  canReply = true,
  canLike = true,
}: CommentProps) => {
  const { isLoggedIn, user: currentUser } = useAuthContext()
  const [likeComment, { isLoading: isLiking }] = useLikeCommentMutation()
  const [unlikeComment, { isLoading: isUnliking }] = useUnlikeCommentMutation()
  const [createReply] = useCreateReplyMutation()
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false)
  const [errorState, setErrorState] = useState<{ id: number; message: string | null }>({ id: 0, message: null })

  const allReplies = flattenReplies(replies)

  const handleLike = async () => {
    try {
      if (isLikedByMe) {
        await unlikeComment({ postId, commentId: id }).unwrap()
      } else {
        await likeComment({ postId, commentId: id }).unwrap()
      }
    } catch (error) {
      setErrorState((prev) => ({ id: prev.id + 1, message: getErrorMessage(error) }))
    }
  }

  const handleReplySubmit = async (content: string) => {
    try {
      await createReply({
        postId,
        commentId: id,
        content,
        currentUserId: currentUser?.userId,
        currentUserName: currentUser?.userName,
      }).unwrap()
      setErrorState((prev) => ({ ...prev, message: null }))
    } catch (error) {
      setErrorState((prev) => ({ id: prev.id + 1, message: getErrorMessage(error) }))
      throw error
    }
  }

  return (
    <div className={s.commentItem}>
      {errorState.message && (
        <Alert key={errorState.id} status="error" text={errorState.message} position="bottom-left" autoDismiss={3000} />
      )}
      {user.avatarUrl ? (
        <Image src={user.avatarUrl} alt={user.username} className={s.userAvatar} width={36} height={36} />
      ) : (
        <PersonIcon className={s.userAvatar} />
      )}

      <div className={s.commentContent}>
        <div className={s.topRow}>
          <p className={s.commentText}>
            <strong className={s.username}>{user.username}</strong> {text}
          </p>
          {isLoggedIn && canLike && (
            <Button
              variant="link"
              className={s.likeButton}
              onClick={() => void handleLike()}
              disabled={isLiking || isUnliking}
            >
              {isLikedByMe ? <HeartIcon color="var(--danger-500)" /> : <HeartOutlineIcon />}
            </Button>
          )}
        </div>

        <div className={s.commentMeta}>
          <span className={s.time}>{time}</span>
          <span className={s.likes}>Like: {likesCount}</span>
          {isLoggedIn && canReply && (
            <button className={s.answerButton} onClick={() => setIsReplyFormOpen((prev) => !prev)} type="button">
              Answer
            </button>
          )}
        </div>

        {isLoggedIn && canReply && isReplyFormOpen && (
          <div className={s.replyFormWrapper}>
            <CommentForm
              defaultValue={`@${user.username} `}
              onSubmit={handleReplySubmit}
              onCancel={() => setIsReplyFormOpen(false)}
              autoFocus
            />
          </div>
        )}

        {allReplies.length > 0 && (
          <div className={s.repliesWrapper}>
            {allReplies.map((reply) => (
              <Comment
                key={reply.id}
                id={reply.id}
                postId={reply.postId}
                user={reply.user}
                text={reply.text}
                time={reply.time}
                likesCount={reply.likesCount}
                isLikedByMe={reply.isLikedByMe}
                replies={[]}
                canReply={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
