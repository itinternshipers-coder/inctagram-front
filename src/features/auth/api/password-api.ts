import { PasswordRecovery, PasswordRecoveryConfirm } from '@/features/auth/model/types'
import { baseApi } from '@/shared/api/base-api'
import { API_ENDPOINTS } from '@/shared/api/endpoints'

export const passwordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    forgotPassword: builder.mutation<PasswordRecovery['response'], PasswordRecovery['request']>({
      query: (body) => ({
        url: API_ENDPOINTS.AUTH.PASSWORD_RECOVERY,
        method: 'POST',
        body,
      }),
    }),
    createNewPassword: builder.mutation<PasswordRecoveryConfirm['response'], PasswordRecoveryConfirm['request']>({
      query: (body) => ({
        url: API_ENDPOINTS.AUTH.PASSWORD_RECOVERY_CONFIRM,
        method: 'POST',
        body,
      }),
    }),
    // Новый endpoint: проверка recovery кода
    verifyRecoveryCode: builder.query<{ message: string }, { code: string }>({
      query: ({ code }) => ({
        url: API_ENDPOINTS.AUTH.PASSWORD_RECOVERY_VERIFY,
        params: { code },
        method: 'GET',
      }),
    }),
  }),
})

export const { useForgotPasswordMutation, useCreateNewPasswordMutation, useVerifyRecoveryCodeQuery } = passwordApi
