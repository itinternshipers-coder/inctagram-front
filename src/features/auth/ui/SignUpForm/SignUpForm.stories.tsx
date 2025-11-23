import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Provider } from 'react-redux'
import { baseApi } from '@/shared/api/base-api'
import { configureStore } from '@reduxjs/toolkit'
import { SignUpForm } from './SignUpForm'

const mockStore = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

const WithRedux = () => (
  <Provider store={mockStore}>
    <SignUpForm />
  </Provider>
)

const meta = {
  title: 'Features/Auth/SignUpForm',
  component: WithRedux,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof WithRedux>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
