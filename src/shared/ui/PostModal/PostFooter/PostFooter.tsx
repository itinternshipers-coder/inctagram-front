import { useAuthContext } from '@/features/auth/lib/use-auth-context'
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
import { Input } from '../../Input/Input'
import { Author } from '@/features/post/model/type'
import { Typography } from '../../Typography/Typography'

type PostFooterProps = {
  localLiked: boolean
  localLikesCount: number
  handleToggleLike: () => void
  handleShare: () => void
  handleAddBookmark: () => void
  handlePublishPost: (text: string) => void
  author: Author
  displayDate: string
  setValue: (value: string) => void
  value: string
}

export const PostFooter = ({
  localLiked,
  localLikesCount,
  handleToggleLike,
  handleShare,
  handleAddBookmark,
  handlePublishPost,
  author,
  displayDate,
}: PostFooterProps) => {
  const [value, setValue] = useState('')
  const onPublish = () => {
    handlePublishPost(value)
    setValue('')
  }
  const { isLoggedIn } = useAuthContext()

  return (
    <div className={s.postFooter}>
      {isLoggedIn && (
        <div className={s.interactionRow}>
          <div className={s.likesInfo}>
            <Button variant="link" className={s.iconButton} aria-label="Like Post" onClick={handleToggleLike}>
              {localLiked ? <HeartIcon color="var(--danger-500)" /> : <HeartOutlineIcon />}
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
            {localLikesCount.toLocaleString('ru-RU')}
          </Typography>{' '}
          <Typography variant="bold_text_14" as="span">{`"Like"`}</Typography>
        </div>
      </div>

      <div className={s.postDate}>{displayDate}</div>
      {isLoggedIn && (
        <div className={s.addCommentSection}>
          <Input placeholder="Add a Comment..." value={value} onChange={(e) => setValue(e.target.value)} />
          <Button className={s.publishCommentButton} onClick={onPublish}>
            Publish
          </Button>
        </div>
      )}
    </div>
  )
}
