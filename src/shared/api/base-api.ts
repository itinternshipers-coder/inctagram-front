import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store/store'
import { setAccessToken, logout } from '@/features/auth/model/auth-slice'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
  // credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.accessToken
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
  let result = await baseQuery(args, api, extraOptions)

  // Автоматический refresh при 401 ошибке
  if (result.error && result.error.status === 401) {
    // Пытаемся обновить токен
    const refreshResult = await baseQuery(
      {
        url: API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        method: 'POST',
      },
      api,
      extraOptions
    )

    if (refreshResult.data) {
      // Сохраняем новый access token
      const { accessToken } = refreshResult.data as { accessToken: string }
      api.dispatch(setAccessToken(accessToken))

      // Повторяем оригинальный запрос
      result = await baseQuery(args, api, extraOptions)
    } else {
      // Не удалось обновить - разлогиниваем
      api.dispatch(logout())
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: [],
  endpoints: () => ({}),
})
