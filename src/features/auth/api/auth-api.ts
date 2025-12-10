import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { baseApi } from '@/shared/api/base-api'
import { ConfirmEmail, Login, Logout, Me, RefreshToken, ResendConfirm, SignUp } from '../model/types'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<Login['response'], Login['request']>({
      query: (body) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<Logout['response'], Logout['request']>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.LOGOUT,
        method: 'POST',
      }),
    }),
    signup: builder.mutation<SignUp['response'], SignUp['request']>({
      query: (body) => ({
        url: API_ENDPOINTS.AUTH.SIGNUP,
        method: 'POST',
        body,
      }),
    }),
    confirmEmail: builder.mutation<ConfirmEmail['response'], ConfirmEmail['request']>({
      query: (body) => ({
        url: API_ENDPOINTS.AUTH.CONFIRM_EMAIL,
        method: 'POST',
        body,
      }),
    }),
    resendConfirm: builder.mutation<ResendConfirm['response'], ResendConfirm['request']>({
      query: (body) => ({
        url: API_ENDPOINTS.AUTH.RESEND_CONFIRMATION,
        method: 'POST',
        body,
      }),
    }),
    refreshToken: builder.mutation<RefreshToken['response'], RefreshToken['request']>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        method: 'POST',
      }),
    }),
    me: builder.query<Me['response'], Me['request']>({
      query: () => API_ENDPOINTS.AUTH.ME,
    }),
  }),
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useConfirmEmailMutation,
  useResendConfirmMutation,
  useRefreshTokenMutation,
  useMeQuery,
} = authApi
