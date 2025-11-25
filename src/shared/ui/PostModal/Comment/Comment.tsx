import { CommentType } from '../types'
import s from './Comment.module.scss'
type CommentProps = Omit<CommentType, 'id' | 'user'> & { user: CommentType['user'] }

export const Comment = ({ user, text, time }: CommentProps) => (
  <div className={s.commentItem}>
    <img src={user.avatarUrl} alt={user.username} className={s.userAvatar} />
    <div className={s.commentContent}>
      <p>
        <strong className={s.username}>{user.username}</strong> {text}
      </p>
      <div className={s.commentMeta}>
        <span>{time}</span>
      </div>
    </div>
  </div>
)
