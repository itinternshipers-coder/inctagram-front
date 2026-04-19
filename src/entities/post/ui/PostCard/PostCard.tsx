import { useGetProfileQuery } from '@/features/profile/api/profile-api'
import { Typography } from '@/shared/ui/Typography/Typography'
import { useEffect, useRef, useState } from 'react'
import { ImageGallery } from '@/shared/ui/PostModal/ImageGallery/ImageGallery'
import Image from 'next/image'
import clsx from 'clsx'
import s from './PostCard.module.scss'
import { PostPhoto } from '../../model'
import { usePathname, useRouter } from 'next/navigation'

export type Props = {
  photos: PostPhoto[]
  timeAgo: string
  description: string
  postId: string
  authorId: string
}

const MAX_LENGTH = 80

export const PostCard = ({ photos, timeAgo, description, postId, authorId }: Props) => {
  const { data: author } = useGetProfileQuery(authorId)
  const [showMore, setShowMore] = useState(false)
  const truncatedContent = description.length > MAX_LENGTH ? description.slice(0, MAX_LENGTH) + '...' : description
  const shouldShowGallery = !showMore && photos.length > 1
  const router = useRouter()

  const isNavigatingRef = useRef(false)
  const pathname = usePathname()

  useEffect(() => {
    isNavigatingRef.current = false
  }, [pathname])

  const handleClick = (postId: string) => {
    if (isNavigatingRef.current) return
    isNavigatingRef.current = true
    router.push(`/post/${postId}`, { scroll: false })
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
          <Image src={photos[0]?.url || ''} alt="Post" className={s.postImageImg} fill />
        )}
      </div>

      <div className={s.postContent}>
        <div className={s.postHeader}>
          <div className={s.userInfo}>
            {author?.avatar?.[0]?.url && (
              <Image src={author.avatar[0].url} alt="User" className={s.userAvatar} width={36} height={36} />
            )}
            <Typography variant="h3">{author?.username}</Typography>
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
