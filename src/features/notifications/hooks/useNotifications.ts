import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import {
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useMarkNotificationsAsReadMutation,
  notificationsApi,
} from '@/features/notifications/api/notifications-api'
import { setUnreadCount } from '@/features/notifications/model/notifications-slice'
import type { Notification } from '@/features/notifications/model/types'

export const useNotifications = (skip = false) => {
  const dispatch = useAppDispatch()
  const unreadCount = useAppSelector((state) => state.notifications.unreadCount)

  const { data, isLoading } = useGetNotificationsQuery(undefined, { skip })
  const [fetchMore, { isFetching: isLoadingMore }] = useLazyGetNotificationsQuery()
  const [markAsRead] = useMarkNotificationsAsReadMutation()

  const [extraItems, setExtraItems] = useState<Notification[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)

  const loadingRef = useRef(false)

  useEffect(() => {
    if (data) {
      dispatch(setUnreadCount(data.items.filter((n) => !n.isReady).length))

      const lastItem = data.items[data.items.length - 1]

      setCursor(lastItem?.id ?? null)
      setHasMore(data.items.length < data.totalCount)
      setExtraItems([])
    }
  }, [data, dispatch])

  const notifications = [...(data?.items ?? []), ...extraItems]

  const loadMore = useCallback(async () => {
    if (!cursor || !hasMore || loadingRef.current) return

    loadingRef.current = true

    try {
      const result = await fetchMore({ cursor, pageSize: 8 }).unwrap()

      setExtraItems((prev) => [...prev, ...result.items])

      const lastItem = result.items[result.items.length - 1]

      setCursor(lastItem?.id ?? null)
      setHasMore(notifications.length + result.items.length < (data?.totalCount ?? 0))
    } finally {
      loadingRef.current = false
    }
  }, [cursor, hasMore, fetchMore, notifications.length, data?.totalCount])

  const markAllAsRead = useCallback(async () => {
    const unreadIds = notifications.filter((n) => !n.isReady).map((n) => n.id)

    if (unreadIds.length === 0) return

    // Оптимистичное обновление — сразу помечаем как прочитанные в UI
    dispatch(
      notificationsApi.util.updateQueryData('getNotifications', undefined, (draft) => {
        draft.items.forEach((n) => {
          n.isReady = true
        })
      })
    )
    setExtraItems((prev) => prev.map((n) => ({ ...n, isReady: true })))
    dispatch(setUnreadCount(0))

    // Отправляем на сервер в фоне
    markAsRead({ ids: unreadIds })
  }, [notifications, markAsRead, dispatch])

  return {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    markAllAsRead,
  }
}
