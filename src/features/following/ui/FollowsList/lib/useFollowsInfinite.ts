import {
  useGetFollowersQuery,
  useGetFollowingQuery,
  useLazyGetFollowersQuery,
  useLazyGetFollowingQuery,
} from '@/features/following/api/following-api'
import type { FollowsListItem } from '@/features/following/model/types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const PAGE_SIZE = 20
const EMPTY_ITEMS: FollowsListItem[] = []

export type FollowsKind = 'followers' | 'following'

type ExtraState = {
  userId: string
  items: FollowsListItem[]
  page: number
}

type UseFollowsInfiniteProps = {
  userId: string
  kind: FollowsKind
}

export const useFollowsInfinite = ({ userId, kind }: UseFollowsInfiniteProps) => {
  const useFirstPage = kind === 'followers' ? useGetFollowersQuery : useGetFollowingQuery
  const useLazyNext = kind === 'followers' ? useLazyGetFollowersQuery : useLazyGetFollowingQuery

  const { data, isLoading, isError, refetch } = useFirstPage({
    userId,
    page: 1,
    pageSize: PAGE_SIZE,
  })

  const [fetchNext, { isFetching: isFetchingMore }] = useLazyNext()
  const [extra, setExtra] = useState<ExtraState>({ userId, items: EMPTY_ITEMS, page: 1 })
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const baseItems = data?.items ?? EMPTY_ITEMS
  const extraItems = extra.userId === userId ? extra.items : EMPTY_ITEMS

  const allItems = useMemo(() => {
    const seen = new Set<string>()
    const merged: FollowsListItem[] = []
    for (const item of [...baseItems, ...extraItems]) {
      if (!seen.has(item.id)) {
        seen.add(item.id)
        merged.push(item)
      }
    }
    return merged
  }, [baseItems, extraItems])

  const totalPages = data?.totalPages ?? 0
  const currentPage = extra.userId === userId ? extra.page : 1
  const hasMore = currentPage < totalPages

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isFetchingMore) return

    const nextPage = currentPage + 1

    try {
      const page = await fetchNext({ userId, page: nextPage, pageSize: PAGE_SIZE }).unwrap()

      setExtra((prev) => {
        const prevItems = prev.userId === userId ? prev.items : EMPTY_ITEMS
        const existing = new Set([...baseItems, ...prevItems].map((it) => it.id))
        const unique = page.items.filter((it) => !existing.has(it.id))
        return {
          userId,
          items: [...prevItems, ...unique],
          page: nextPage,
        }
      })
    } catch (e) {
      console.error('Failed to load more follows:', e)
    }
  }, [baseItems, currentPage, fetchNext, hasMore, isFetchingMore, userId])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void handleLoadMore()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [handleLoadMore])

  return {
    allItems,
    totalCount: data?.totalCount ?? 0,
    isLoading,
    isError,
    isFetchingMore,
    sentinelRef,
    refetch,
  }
}
