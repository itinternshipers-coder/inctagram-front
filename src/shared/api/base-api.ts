import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store/store'
import { setAccessToken, logout } from '@/features/auth/model/auth-slice'
import { Mutex } from 'async-mutex'

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  await mutex.waitForUnlock()

  let result = await baseQuery(args, api, extraOptions)

  // Автоматический refresh при 401 ошибке
  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()

      try {
        const refreshResult = await baseQuery(
          { url: API_ENDPOINTS.AUTH.REFRESH_TOKEN, method: 'POST' },
          api,
          extraOptions
        )

        if (refreshResult.data) {
          // Сохраняем новый access token
          const { accessToken } = refreshResult.data as { accessToken: string }
          api.dispatch(setAccessToken(accessToken))

          result = await baseQuery(args, api, extraOptions)
        } else {
          api.dispatch(logout())
        }
      } catch (error) {
        api.dispatch(logout())
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()

      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Post', 'Posts', 'Sessions', 'Profile', 'Auth', 'Subscriptions'],
  endpoints: () => ({}),
})
