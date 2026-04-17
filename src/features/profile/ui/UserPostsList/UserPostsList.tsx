'use client'

import { Post } from '@/entities/post/model'
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
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
  const isNavigatingRef = useRef(false)
  const pathname = usePathname()

  useEffect(() => {
    isNavigatingRef.current = false
  }, [pathname])

  const handlePostClick = (e: React.MouseEvent) => {
    if (isNavigatingRef.current) {
      e.preventDefault()
      return
    }
    isNavigatingRef.current = true
  }

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
              <Link href={`/post/${post.id}`} onClick={handlePostClick} scroll={false}>
                {post.photos?.[0]?.url ? (
                  <Image className={s.image} src={post.photos[0].url} alt={post.description || 'Post'} fill />
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
