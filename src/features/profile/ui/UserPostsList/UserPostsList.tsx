'use client'

import { Post } from '@/entities/post/model'
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton'
import Link from 'next/link'
import s from './UserPostsList.module.scss'
import { useUserPostsInfinite } from './lib/useUserPostsInfinite'

type Props = {
  userId: string
  initialPosts: Post[]
  initialTotalCount: number
}

export const UserPostsList = ({ userId, initialPosts, initialTotalCount }: Props) => {
  const { allPosts, isLoading, isError, isFetchingMore, sentinelRef, pageSize } = useUserPostsInfinite({
    userId,
    initialPosts,
    initialTotalCount,
  })

  if (isLoading) {
    return (
      <div className={s.skeletonGrid}>
        {Array.from({ length: pageSize }).map((_, index) => (
          <Skeleton key={`initial-${index}`} className={s.skeletonItem} />
        ))}
      </div>
    )
  }

  if (isError) {
    return <div className={s.status}>Error loading posts</div>
  }

  return (
    <div className={s.wrapper}>
      {allPosts.length > 0 ? (
        <div className={s.grid}>
          {allPosts.map((post) => (
            <article key={post.id} className={s.card}>
              <Link href={`/post/${post.id}`}>
                {post.photos?.[0]?.url ? (
                  <img className={s.image} src={post.photos[0].url} alt={post.description || 'Post'} />
                ) : (
                  <div className={s.empty}>
                    <span>{post.description?.substring(0, 50) || 'No description'}...</span>
                  </div>
                )}
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className={s.status}>No posts yet</p>
      )}

      {isFetchingMore && (
        <div className={s.skeletonGrid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`more-${index}`} className={s.skeletonItem} />
          ))}
        </div>
      )}

      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  )
}
