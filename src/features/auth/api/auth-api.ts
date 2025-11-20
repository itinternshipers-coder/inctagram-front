import { baseApi } from '@/shared/api/base-api'
import { ConfirmEmail, Login, Logout, Me, RefreshToken, ResendConfirm, SignUp } from '../model/types'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<Login['response'], Login['request']>({
      query: (body) => ({
        url: '/auth/sign-in',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<Logout['response'], Logout['request']>({
      query: () => ({
        url: '/auth/sign-out',
        method: 'POST',
      }),
    }),
    signup: builder.mutation<SignUp['response'], SignUp['request']>({
      query: (body) => ({
        url: '/auth/sign-up',
        method: 'POST',
        body,
      }),
    }),
    confirmEmail: builder.mutation<ConfirmEmail['response'], ConfirmEmail['request']>({
      query: (body) => ({
        url: '/auth/confirm-email',
        method: 'POST',
        body,
      }),
    }),
    resendConfirm: builder.mutation<ResendConfirm['response'], ResendConfirm['request']>({
      query: (body) => ({
        url: '/auth/resend-confirmation',
        method: 'POST',
        body,
      }),
    }),
    refreshToken: builder.mutation<RefreshToken['response'], RefreshToken['request']>({
      query: () => ({
        url: '/auth/refresh-token',
        method: 'POST',
      }),
    }),
    me: builder.query<Me['response'], Me['request']>({
      query: () => '/auth/me',
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
