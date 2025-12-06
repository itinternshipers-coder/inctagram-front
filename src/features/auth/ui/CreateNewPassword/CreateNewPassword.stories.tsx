import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Provider } from 'react-redux'
import { baseApi } from '@/shared/api/base-api'
import { configureStore } from '@reduxjs/toolkit'
import { CreateNewPassword } from './CreateNewPassword'

const mockStore = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

const WithRedux = (args: { recoveryCode?: string }) => (
  <Provider store={mockStore}>
    <CreateNewPassword recoveryCode={args.recoveryCode} />
  </Provider>
)

const meta = {
  title: 'Features/Auth/CreateNewPassword',
  component: WithRedux,
  parameters: {
    layout: 'centered',
  },
  args: {
    recoveryCode: 'abc-123-def-456',
  },
  argTypes: {
    recoveryCode: {
      control: 'text',
      description: 'Recovery code from URL (if empty, shows input field)',
    },
  },
} satisfies Meta<typeof WithRedux>

export default meta

type Story = StoryObj<typeof meta>

export const WithRecoveryCode: Story = {
  args: {
    recoveryCode: 'pre-filled-code-123',
  },
}
