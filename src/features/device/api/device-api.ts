import { GetSessionsResponse } from '@/features/device/model/types'
import { baseApi } from '@/shared/api/base-api'
import { API_ENDPOINTS, EndpointHelpers } from '@/shared/api/endpoints'

export const deviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSessions: builder.query<GetSessionsResponse, void>({
      query: () => API_ENDPOINTS.SESSIONS.BASE,
    }),
    terminateAllSessions: builder.mutation<void, void>({
      query: () => ({
        url: API_ENDPOINTS.SESSIONS.TERMINATE_ALL,
        method: 'DELETE',
      }),
    }),
    deleteSession: builder.mutation<void, string>({
      query: (deviceId) => ({
        url: EndpointHelpers.sessions.byDevice(deviceId),
        method: 'DELETE',
      }),
    }),
  }),
})

export const { useGetSessionsQuery, useTerminateAllSessionsMutation, useDeleteSessionMutation } = deviceApi
