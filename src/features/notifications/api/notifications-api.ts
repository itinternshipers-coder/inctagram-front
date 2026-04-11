import { baseApi } from '@/shared/api/base-api'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import {
  Notification,
  NotificationsResponse,
  NotificationsParams,
  MarkAsReadRequest,
} from '@/features/notifications/model/types'
import { RootState } from '@/store/store'
import { incrementUnread } from '@/features/notifications/model/notifications-slice'
import { io } from 'socket.io-client'

const WS_URL = 'https://gateway.traineegramm.ru/notifications'

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, NotificationsParams | void>({
      query: (params) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.BASE,
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: ['Notifications'],
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState, dispatch }) {
        const token = (getState() as RootState).auth.accessToken

        if (!token) return

        const socket = io(WS_URL, {
          query: { token },
          transports: ['websocket'],
        })

        try {
          await cacheDataLoaded

          const receivedIds = new Set<string>()

          socket.on('notifications', (notification: Notification, ack) => {
            if (!receivedIds.has(notification.id)) {
              receivedIds.add(notification.id)

              updateCachedData((draft) => {
                draft.items.unshift(notification)
                draft.totalCount += 1
              })

              dispatch(incrementUnread())
            }

            if (typeof ack === 'function') {
              ack()
            }
          })
        } catch {
          // cacheEntryRemoved resolved before cacheDataLoaded — no-op
        }

        await cacheEntryRemoved
        socket.disconnect()
      },
    }),

    markNotificationsAsRead: builder.mutation<void, MarkAsReadRequest>({
      query: (body) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.BASE,
        method: 'PUT',
        body,
      }),
    }),
  }),
})

export const { useGetNotificationsQuery, useLazyGetNotificationsQuery, useMarkNotificationsAsReadMutation } =
  notificationsApi
