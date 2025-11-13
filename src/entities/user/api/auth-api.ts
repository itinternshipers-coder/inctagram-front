import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type LoginResponse = {
  username: string
  email: string
  password: string
}

type LoginRequest = {
  message: string
  userId: string
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}`,
    // здесь можно добавить подготовку headers
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'sign-in',
        method: 'POST',
        body: credentials,
      }),
    }),
    // другие endpoints...
  }),
})

export const { useLoginMutation } = authApi
