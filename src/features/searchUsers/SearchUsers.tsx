'use client'

import { useLazySearchUsersQuery, useSearchUsersQuery } from '@/features/following/api/following-api'
import type { UserSearchItem } from '@/features/following/model/types'
import { ROUTES } from '@/shared/config/routes'
import { Button } from '@/shared/ui/Button/Button'
import { Input } from '@/shared/ui/Input/Input'
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton'
import { Typography } from '@/shared/ui/Typography/Typography'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import s from './SearchUsers.module.scss'

const DEBOUNCE_MS = 350
const PAGE_SIZE = 20
const SKELETON_COUNT = 6
const EMPTY_ITEMS: UserSearchItem[] = []

type ExtraResultsState = {
  items: UserSearchItem[]
  nextCursor: string | null
  hasMore: boolean
  query: string
}

const initialExtraState: ExtraResultsState = {
  items: EMPTY_ITEMS,
  nextCursor: null,
  hasMore: false,
  query: '',
}

export const SearchUsers = () => {
  const [searchValue, setSearchValue] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [extraResults, setExtraResults] = useState<ExtraResultsState>(initialExtraState)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(searchValue.trim())
    }, DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [searchValue])

  const hasQuery = debouncedQuery.length > 0

  const { data, isLoading, isFetching, isError, refetch } = useSearchUsersQuery(
    { username: debouncedQuery, pageSize: PAGE_SIZE },
    { skip: !hasQuery }
  )

  const [fetchNextPage, { isFetching: isFetchingMore }] = useLazySearchUsersQuery()

  const baseItems = data?.items ?? EMPTY_ITEMS
  const extraItems = extraResults.query === debouncedQuery ? extraResults.items : EMPTY_ITEMS

  const mergedItems = useMemo(() => {
    const seen = new Set<string>()
    const items: UserSearchItem[] = []

    for (const item of [...baseItems, ...extraItems]) {
      if (seen.has(item.id)) {
        continue
      }

      seen.add(item.id)
      items.push(item)
    }

    return items
  }, [baseItems, extraItems])

  const nextCursor = extraItems.length > 0 ? extraResults.nextCursor : (data?.nextCursor ?? null)
  const hasMore = extraItems.length > 0 ? extraResults.hasMore : (data?.hasMore ?? false)

  const handleLoadMore = useCallback(async () => {
    if (!hasQuery || !hasMore || !nextCursor || isFetchingMore) {
      return
    }

    try {
      const response = await fetchNextPage({
        username: debouncedQuery,
        pageSize: PAGE_SIZE,
        cursor: nextCursor,
      }).unwrap()

      setExtraResults((prev) => {
        const prevItems = prev.query === debouncedQuery ? prev.items : EMPTY_ITEMS
        const existingIds = new Set([...baseItems, ...prevItems].map((item) => item.id))
        const uniqueItems = response.items.filter((item) => !existingIds.has(item.id))

        return {
          items: [...prevItems, ...uniqueItems],
          nextCursor: response.nextCursor,
          hasMore: response.hasMore,
          query: debouncedQuery,
        }
      })
    } catch (error) {
      console.error('Failed to load more search results:', error)
    }
  }, [baseItems, debouncedQuery, fetchNextPage, hasMore, hasQuery, isFetchingMore, nextCursor])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasQuery) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
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
  }, [handleLoadMore, hasQuery])

  const showInitialSkeleton = hasQuery && mergedItems.length === 0 && (isLoading || isFetching)

  return (
    <section className={s.wrapper}>
      <header className={s.header}>
        <Typography as="h1" variant="h1">
          Search
        </Typography>
      </header>

      <Input
        type="search"
        placeholder="Search by username"
        value={searchValue}
        onChange={(event) => setSearchValue(event.currentTarget.value)}
        wrapperClassName={s.searchField}
      />

      {!searchValue.trim() ? (
        <Typography className={s.status} variant="regular_text_16">
          Start typing a username to see matching profiles.
        </Typography>
      ) : showInitialSkeleton ? (
        <ul className={s.list} aria-label="Loading search results">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <li key={`search-skeleton-${index}`} className={s.skeletonRow}>
              <Skeleton width={48} height={48} borderRadius="50%" />
              <div className={s.skeletonText}>
                <Skeleton width="45%" height={16} />
                <Skeleton width="25%" height={12} />
              </div>
            </li>
          ))}
        </ul>
      ) : isError ? (
        <div className={s.statusBlock}>
          <Typography className={s.status} variant="regular_text_16">
            Failed to load search results.
          </Typography>
          <Button variant="secondary" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : mergedItems.length === 0 ? (
        <Typography className={s.status} variant="regular_text_16">
          No users found for &quot;{debouncedQuery}&quot;.
        </Typography>
      ) : (
        <ul className={s.list}>
          {mergedItems.map((user) => (
            <li key={user.id}>
              <Link href={ROUTES.DYNAMIC.PROFILE(user.id)} className={s.userLink}>
                {user.avatarUrl ? (
                  <Image src={user.avatarUrl} alt={user.username} width={48} height={48} className={s.avatar} />
                ) : (
                  <div className={s.avatarPlaceholder} aria-hidden>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className={s.userInfo}>
                  <Typography as="span" variant="bold_text_16">
                    {user.username}
                  </Typography>
                  <Typography as="span" variant="small_text" className={s.userHint}>
                    Open profile
                  </Typography>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {isFetchingMore && (
        <div className={s.loadingMore}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`loading-more-${index}`} className={s.skeletonRow}>
              <Skeleton width={48} height={48} borderRadius="50%" />
              <div className={s.skeletonText}>
                <Skeleton width="45%" height={16} />
                <Skeleton width="25%" height={12} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div ref={sentinelRef} className={s.sentinel} aria-hidden />
    </section>
  )
}
