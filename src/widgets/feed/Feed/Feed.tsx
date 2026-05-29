'use client'

import { useGetFeedQuery } from '@/entities/post/api/posts-api'
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton'
import { FeedPostCard } from '@/widgets/feed/FeedPostCard/FeedPostCard'
import { useEffect, useRef, useState } from 'react'
import s from './Feed.module.scss'

const PAGE_SIZE = 8

export const Feed = () => {
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const { data, isLoading, isFetching, isError } = useGetFeedQuery({ cursor, pageSize: PAGE_SIZE })
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && data?.hasMore && !isFetching) {
          if (data.nextCursor) setCursor(data.nextCursor)
        }
      },
      { rootMargin: '200px' }
    )
    const sentinel = sentinelRef.current
    if (sentinel) observer.observe(sentinel)
    return () => {
      if (sentinel) observer.unobserve(sentinel)
    }
  }, [data?.hasMore, data?.nextCursor, isFetching])

  if (isLoading && !data) {
    return (
      <div className={s.skeletonGrid}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height={400} borderRadius="12px" />
        ))}
      </div>
    )
  }

  if (isError && !data) return <div className={s.status}>Failed to load feed</div>

  const posts = data?.items ?? []
  if (posts.length === 0 && !isLoading)
    return <div className={s.status}>Subscribe to other users to see their publications</div>

  return (
    <div className={s.feed}>
      {posts.map((post) => (
        <FeedPostCard key={post.id} post={post} />
      ))}
      {isFetching && (
        <div className={s.skeletonGrid}>
          <Skeleton height={400} borderRadius="12px" />
        </div>
      )}
      {data?.hasMore && <div ref={sentinelRef} className={s.sentinel} />}
    </div>
  )
}
