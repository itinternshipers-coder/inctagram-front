import { Typography } from '@/shared/ui/Typography/Typography'
import { useState } from 'react'
import { ImageGallery } from '@/shared/ui/PostModal/ImageGallery/ImageGallery'

import clsx from 'clsx'
import s from './PostCard.module.scss'
import { PostPhoto } from '../../model'

export type Props = {
  photos: PostPhoto[]
  userProfileImage: string
  userName: string
  timeAgo: string
  description: string
}

const MAX_LENGTH = 80

export const PostCard = ({ photos, userProfileImage, userName, timeAgo, description }: Props) => {
  const [showMore, setShowMore] = useState(false)
  const truncatedContent = description.length > MAX_LENGTH ? description.slice(0, MAX_LENGTH) + '...' : description
  const shouldShowGallery = !showMore && photos.length > 1

  return (
    <div className={s.post}>
      <div className={clsx(s.postImage, showMore ? s.collapsed : '')}>
        {shouldShowGallery ? (
          <ImageGallery photos={photos} />
        ) : (
          <img src={photos[0]?.url || ''} alt="Post" className={s.postImageImg} />
        )}
      </div>

      <div className={s.postContent}>
        <div className={s.postHeader}>
          <div className={s.userInfo}>
            <img src={userProfileImage} alt="User" className={s.userAvatar} />
            <Typography variant="h3">{userName}</Typography>
          </div>
          <Typography className={s.timeAgo} variant="small_text">
            {timeAgo}
          </Typography>
        </div>

        <span>
          <Typography as="span" variant="regular_text_14">
            {showMore ? description : truncatedContent}
          </Typography>
          {description.length > MAX_LENGTH && (
            <Typography
              className={s.showMoreBtn}
              as="button"
              variant="regular_link"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? 'Hide' : 'Show more'}
            </Typography>
          )}
        </span>
      </div>
    </div>
  )
}
