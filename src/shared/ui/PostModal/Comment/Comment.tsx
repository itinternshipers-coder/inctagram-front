import { useAuthContext } from '@/features/auth/lib/use-auth-context'
import { useState } from 'react'
import s from './Comment.module.scss'
import { HeartIcon, HeartOutlineIcon, PersonIcon } from '@/shared/icons/svgComponents'
import Image from 'next/image'
import { CommentType } from '@/features/post/model/type'
import { Button } from '../../Button/Button'

type CommentProps = Omit<CommentType, 'id' | 'user'> & {
  user: CommentType['user']
  handleOnChange?: (username: string) => void
}

const flattenReplies = (replies?: CommentType[]): CommentType[] => {
  if (!replies) return []
  let flat: CommentType[] = []
  replies.forEach((r) => {
    flat.push({ ...r })
    if (r.replies && r.replies.length > 0) {
      flat = flat.concat(flattenReplies(r.replies))
    }
  })
  return flat
}

export const Comment = ({ user, text, time, likesCount, replies, handleOnChange }: CommentProps) => {
  const initialLikes = likesCount || 0
  const [likes, setLikesCount] = useState<number>(initialLikes)
  const [localLiked, setLocalLiked] = useState(false)
  const { isLoggedIn } = useAuthContext()

  const handleLike = () => {
    setLocalLiked(!localLiked)
    setLikesCount((prev) => prev + (localLiked ? -1 : 1))
  }

  const allReplies = flattenReplies(replies)

  return (
    <div className={s.commentItem}>
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
          {isLoggedIn && (
            <Button variant="link" className={s.likeButton} onClick={handleLike}>
              {localLiked ? <HeartIcon color="var(--danger-500)" /> : <HeartOutlineIcon />}
            </Button>
          )}
        </div>

        <div className={s.commentMeta}>
          <span className={s.time}>{time}</span>
          {isLoggedIn && <span className={s.likes}>Like: {likes}</span>}
          {handleOnChange && (
            <button className={s.answerButton} onClick={() => handleOnChange(user.username)}>
              Answer
            </button>
          )}
        </div>

        {allReplies.length > 0 && (
          <div className={s.repliesWrapper}>
            {allReplies.map((reply) => (
              <Comment
                key={reply.id}
                user={reply.user}
                text={reply.text}
                time={reply.time}
                likesCount={reply.likesCount}
                replies={[]}
                handleOnChange={handleOnChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
