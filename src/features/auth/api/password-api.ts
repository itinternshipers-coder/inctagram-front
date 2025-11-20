import { PasswordRecovery, PasswordRecoveryConfirm } from '@/features/auth/model/types'
import { baseApi } from '@/shared/api/base-api'

export const passwordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    forgotPassword: builder.mutation<PasswordRecovery['response'], PasswordRecovery['request']>({
      query: (body) => ({
        url: '/auth/password-recovery',
        method: 'POST',
        body,
      }),
    }),
    createNewPassword: builder.mutation<PasswordRecoveryConfirm['response'], PasswordRecoveryConfirm['request']>({
      query: (body) => ({
        url: '/auth/password-recovery-confirm',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useForgotPasswordMutation, useCreateNewPasswordMutation } = passwordApi
