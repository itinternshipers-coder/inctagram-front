import { useGetProfileQuery } from '@/features/profile/api/profile-api'
import { Typography } from '@/shared/ui/Typography/Typography'
import { useState } from 'react'
import { ImageGallery } from '@/shared/ui/PostModal/ImageGallery/ImageGallery'
import clsx from 'clsx'
import s from './PostCard.module.scss'
import { PostPhoto, useGetPostByIdQuery } from '../../model'
import { useRouter } from 'next/navigation'
import { skipToken } from '@reduxjs/toolkit/query/react'

export type Props = {
  photos: PostPhoto[]
  timeAgo: string
  description: string
  postId: string
}

const MAX_LENGTH = 80

export const PostCard = ({ photos, timeAgo, description, postId }: Props) => {
  const { data } = useGetPostByIdQuery(postId ? { id: postId } : skipToken)
  const { data: author } = useGetProfileQuery(data?.author?.id ?? skipToken)
  const [showMore, setShowMore] = useState(false)
  const truncatedContent = description.length > MAX_LENGTH ? description.slice(0, MAX_LENGTH) + '...' : description
  const shouldShowGallery = !showMore && photos.length > 1
  const router = useRouter()

  const handleClick = (postId: string) => {
    router.push(`/post/${postId}`)
  }
  const handleShowMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMore((prev) => !prev)
  }
  return (
    <div className={s.post} onClick={() => handleClick(postId)}>
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
            <img src={author?.avatar?.[0]?.url} alt="User" className={s.userAvatar} />
            <Typography variant="h3">{data?.author?.username}</Typography>
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
            <Typography className={s.showMoreBtn} as="button" variant="regular_link" onClick={handleShowMoreClick}>
              {showMore ? 'Hide' : 'Show more'}
            </Typography>
          )}
        </span>
      </div>
    </div>
  )
}
