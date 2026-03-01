'use client'

import { useGetPostByIdQuery } from '@/entities/post/model'
import { useGetProfileQuery } from '@/features/profile/api/profile-api'
import Loader from '@/shared/ui/Loader/Loader'
import { skipToken } from '@reduxjs/toolkit/query/react'
import s from './PostView.module.scss'

type Props = {
  postId: string
}

export function PostView({ postId }: Props) {
  const { data, isLoading, isError } = useGetPostByIdQuery({ id: postId })
  const post = data?.item
  const { data: profile } = useGetProfileQuery(post?.authorId ?? skipToken)
  if (isLoading) {
    return <Loader />
  }
  if (!post) return null

  if (isError) {
    console.log(isError)
  }
  const sortedPhotos = [...post.photos].sort((a, b) => a.order - b.order)

  return (
    <article className={s.post}>
      {/* Header */}
      <header className={s.header}>
        <span className={s.author}>Author: {profile?.username ?? 'No name'}</span>
        <time className={s.date}>{new Date(post.createdAt).toLocaleDateString()}</time>
      </header>

      {/* Photos */}
      {sortedPhotos.length > 0 && (
        <div className={s.gallery}>
          {sortedPhotos.map((photo) => (
            <div key={photo.id} className={s.imageWrapper}>
              <img src={photo.url} alt="Post photo" width={350} height={200} />
            </div>
          ))}
        </div>
      )}

      {/* Description */}
      {post.description && <p className={s.description}>{post.description}</p>}
    </article>
  )
}
