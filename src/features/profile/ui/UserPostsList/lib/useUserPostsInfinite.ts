import { useGetUserPostsQuery, useLazyGetUserPostsQuery } from '@/entities/post/api/posts-api'
import { Post } from '@/entities/post/model'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const PAGE_SIZE = '8'
const EMPTY_POSTS: Post[] = []

type ExtraPostsState = {
  userId: string
  items: Post[]
}

type UseUserPostsInfiniteProps = {
  userId: string
}

export const useUserPostsInfinite = ({ userId }: UseUserPostsInfiniteProps) => {
  const { data, isLoading, isError } = useGetUserPostsQuery({
    userId,
    pageSize: PAGE_SIZE,
    sortDirection: 'desc',
  })

  const [extraPostsState, setExtraPostsState] = useState<ExtraPostsState>({ userId, items: EMPTY_POSTS })
  const [fetchNextPosts, { isFetching: isFetchingMore }] = useLazyGetUserPostsQuery()
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const basePosts = useMemo(() => data?.items ?? EMPTY_POSTS, [data?.items])
  const extraPosts = extraPostsState.userId === userId ? extraPostsState.items : EMPTY_POSTS

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

      setExtraPostsState((prevState) => {
        const prevItems = prevState.userId === userId ? prevState.items : EMPTY_POSTS
        const existing = new Set([...basePosts, ...prevItems].map((post) => post.id))
        const uniqueNewPosts = nextPage.items.filter((post) => !existing.has(post.id))

        return {
          userId,
          items: [...prevItems, ...uniqueNewPosts],
        }
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

  return {
    allPosts,
    isLoading,
    isError,
    isFetchingMore,
    sentinelRef,
    pageSize: Number(PAGE_SIZE),
  }
}
