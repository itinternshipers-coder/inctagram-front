'use client'

import { useGetUserPostsQuery, useLazyGetUserPostsQuery } from '@/entities/post/api/posts-api'
import { Post } from '@/entities/post/model'
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import s from './UserPostsList.module.scss'

type Props = {
  userId: string
}

const PAGE_SIZE = '8'
const EMPTY_POSTS: Post[] = []

export const UserPostsList = ({ userId }: Props) => {
  const { data, isLoading, isError } = useGetUserPostsQuery({
    userId,
    pageSize: PAGE_SIZE,
    sortDirection: 'desc',
  })

  const [extraPosts, setExtraPosts] = useState<Post[]>([])
  const [fetchNextPosts, { isFetching: isFetchingMore }] = useLazyGetUserPostsQuery()
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const basePosts = useMemo(() => data?.items ?? EMPTY_POSTS, [data?.items])

  const allPosts = useMemo(() => {
    const seen = new Set<string>()
    const merged: Post[] = []

    for (const post of [...basePosts, ...extraPosts]) {
      if (!seen.has(post.id)) {
        seen.add(post.id)
        merged.push(post)
      }
    }

    return merged
  }, [basePosts, extraPosts])

  const cursor = allPosts.length > 0 ? allPosts[allPosts.length - 1].id : null
  const hasMore = data ? data.totalCount > allPosts.length : false

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || !cursor || isFetchingMore) {
      return
    }

    try {
      const nextPage = await fetchNextPosts({
        userId,
        cursor,
        pageSize: PAGE_SIZE,
        sortDirection: 'desc',
      }).unwrap()

      if (!nextPage.items.length) {
        return
      }

      setExtraPosts((prev) => {
        const existing = new Set([...basePosts, ...prev].map((post) => post.id))
        const uniqueNewPosts = nextPage.items.filter((post) => !existing.has(post.id))

        return [...prev, ...uniqueNewPosts]
      })
    } catch (error) {
      console.error('Failed to load more posts:', error)
    }
  }, [basePosts, cursor, fetchNextPosts, hasMore, isFetchingMore, userId])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (!firstEntry?.isIntersecting) {
          return
        }

        void handleLoadMore()
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [handleLoadMore])

  if (isLoading) {
    return (
      <div className={s.skeletonGrid}>
        {Array.from({ length: Number(PAGE_SIZE) }).map((_, index) => (
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
              {post.photos?.[0]?.url ? (
                <img className={s.image} src={post.photos[0].url} alt={post.description || 'Post'} />
              ) : (
                <div className={s.empty}>
                  <span>{post.description?.substring(0, 50) || 'No description'}...</span>
                </div>
              )}
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
