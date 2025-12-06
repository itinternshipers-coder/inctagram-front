import { baseApi } from '@/shared/api/base-api'
import { API_ENDPOINTS, EndpointHelpers } from '@/shared/api/endpoints'
import { GetSessions, TerminateAllSessions, TerminateSession } from '@/features/session/model/types'

export const sessionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Получить все сессии пользователя
    getSessions: builder.query<GetSessions['response'], GetSessions['request']>({
      query: () => ({
        url: API_ENDPOINTS.SESSIONS.BASE,
        method: 'GET',
      }),
      providesTags: ['Sessions'],
    }),

    // Завершить все сессии, кроме текущей
    terminateAllSessions: builder.mutation<TerminateAllSessions['response'], TerminateAllSessions['request']>({
      query: () => ({
        url: API_ENDPOINTS.SESSIONS.TERMINATE_ALL,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sessions'],
    }),

    // Завершить конкретную сессию по deviceId
    terminateSession: builder.mutation<TerminateSession['response'], TerminateSession['request']>({
      query: ({ deviceId }) => ({
        url: EndpointHelpers.sessions.byDevice(deviceId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Sessions'],
    }),
  }),
})

export const { useGetSessionsQuery, useTerminateAllSessionsMutation, useTerminateSessionMutation } = sessionsApi
