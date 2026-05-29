'use client'

import { AuthContext } from '@/features/auth/providers/auth-context'
import { Input } from '@/shared/ui/Input/Input'
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton'
import { Typography } from '@/shared/ui/Typography/Typography'
import { useContext, useMemo, useState } from 'react'
import { FollowsListItem } from './FollowsListItem'
import s from './FollowsList.module.scss'
import { FollowsKind, useFollowsInfinite } from './lib/useFollowsInfinite'
import { useGetFollowingQuery } from '@/features/following/api/following-api'

type Props = {
  userId: string
  kind: FollowsKind
}

const TITLES: Record<FollowsKind, string> = {
  followers: 'Followers',
  following: 'Following',
}

const EMPTY_TEXTS: Record<FollowsKind, string> = {
  followers: 'No followers yet',
  following: 'No following yet',
}

const SKELETON_COUNT = 6

export const FollowsList = ({ userId, kind }: Props) => {
  const { user, isLoggedIn } = useContext(AuthContext)
  const currentUserId = isLoggedIn ? user?.userId : undefined
  const isOwnPage = !!currentUserId && currentUserId === userId

  const { allItems, totalCount, isLoading, isError, isFetchingMore, sentinelRef } = useFollowsInfinite({
    userId,
    kind,
  })

  // Загружаем список на кого я подписан (только когда смотрю своих подписчиков)
  const { data: myFollowing, isLoading: loadingFollowing } = useGetFollowingQuery(
    { userId: currentUserId!, page: 1, pageSize: 10 },
    { skip: !(isOwnPage && kind === 'followers' && isLoggedIn && currentUserId) }
  )

  const followingIds = useMemo(() => {
    if (!myFollowing?.items) return new Set<string>()
    return new Set(myFollowing.items.map((item) => item.id))
  }, [myFollowing])

  const [searchQuery, setSearchQuery] = useState('')
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return allItems
    return allItems.filter((it) => it.username.toLowerCase().includes(q))
  }, [allItems, searchQuery])

  const showDelete = kind === 'followers' && isOwnPage

  // Показываем скелетон только при загрузке основного списка
  if (isLoading) {
    return (
      <div className={s.wrapper}>
        <header className={s.header}>
          <Typography variant="h1" as="h2" className={s.title}>
            {totalCount} {TITLES[kind]}
          </Typography>
        </header>
        <ul className={s.list}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <li key={i} className={s.skeletonRow}>
              <Skeleton width={48} height={48} borderRadius="50%" />
              <Skeleton width="60%" height={16} />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (isError) return <p className={s.status}>Error loading {kind}</p>
  if (allItems.length === 0) return <p className={s.status}>{EMPTY_TEXTS[kind]}</p>

  return (
    <div className={s.wrapper}>
      <header className={s.header}>
        <Typography variant="h1" as="h2" className={s.title}>
          {totalCount} {TITLES[kind]}
        </Typography>
      </header>

      <div className={s.search}>
        <Input
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredItems.length === 0 ? (
        <p className={s.status}>No matches for &laquo;{searchQuery}&raquo;</p>
      ) : (
        <ul className={s.list}>
          {filteredItems.map((item) => {
            // Определяем состояние подписки
            let initialIsFollowed = false
            if (isLoggedIn && item.id !== currentUserId) {
              if (isOwnPage && kind === 'following') {
                initialIsFollowed = true
              } else if (isOwnPage && kind === 'followers') {
                // Важно: учитываем, что myFollowing может ещё грузиться
                initialIsFollowed = !loadingFollowing && followingIds.has(item.id)
              }
            }

            return (
              <FollowsListItem
                key={item.id}
                item={item}
                currentUserId={currentUserId}
                initialIsFollowed={initialIsFollowed}
                hideAction={!isLoggedIn || item.id === currentUserId}
                showDelete={showDelete && item.id !== currentUserId}
              />
            )
          })}
        </ul>
      )}

      {isFetchingMore && (
        <div className={s.loadingMore}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={s.skeletonRow}>
              <Skeleton width={48} height={48} borderRadius="50%" />
              <Skeleton width="60%" height={16} />
            </div>
          ))}
        </div>
      )}

      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  )
}
