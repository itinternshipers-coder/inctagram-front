import * as Toggle from '@radix-ui/react-toggle'
// import * as Toggle from '@radix-ui/react-to'

import s from '../PostModal.module.scss'
import { Button } from '../../Button/Button'
import { BookmarkOutlineIcon, HeartOutlineIcon, PaperPlaneOutlineIcon } from '@/shared/icons/svgComponents'
import { Input } from '../../Input/Input'
import { Author } from '../PostModal'

type PostFooterProps = {
  localLiked: boolean
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
  handleToggleLike,
  handleShare,
  handleAddBookmark,
  handlePublishPost,
  author,
  displayDate,
  setValue,
  value,
}: PostFooterProps) => {
  const onPublish = () => {
    handlePublishPost(value)
    setValue('')
  }

  return (
    <div className={s.postFooter}>
      <div className={s.interactionRow}>
        <div className={s.likesInfo}>
          <Toggle.Root className={s.likeButton} aria-label="Like Post">
            <Button onClick={handleToggleLike} variant="link" className={s.iconButton}>
              {localLiked ? <HeartOutlineIcon color="red" /> : <HeartOutlineIcon />}
            </Button>
          </Toggle.Root>

          <Button onClick={handleShare} variant="link" className={s.iconButton}>
            <PaperPlaneOutlineIcon />
          </Button>
        </div>

        <Button className={s.iconButton} onClick={handleAddBookmark} variant="link">
          <BookmarkOutlineIcon />
        </Button>
      </div>

      <div className={s.likesInfo}>
        {author.avatarUrl && <img src={author.avatarUrl} alt={author.username} className={s.userThumbnail} />}
        <div className={s.likesCount}>0 Like</div>
      </div>

      <div className={s.postDate}>{displayDate}</div>

      <div className={s.addCommentSection}>
        <Input placeholder="Add a Comment..." value={value} onChange={(e) => setValue(e.target.value)} />
        <Button className={s.publishCommentButton} onClick={onPublish}>
          Publish
        </Button>
      </div>
    </div>
  )
}
