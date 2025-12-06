import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Provider } from 'react-redux'
import { baseApi } from '@/shared/api/base-api'
import { configureStore } from '@reduxjs/toolkit'
import { ResendPasswordLinkRecovery } from './ResendPasswordLinkRecovery'

const mockStore = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

interface ResendWrapperProps {
  email: string
  oldRecoveryCode: string
  hasError?: boolean
}

const ResendWrapper = (props: ResendWrapperProps) => {
  const mockError = props.hasError
    ? {
        errorsMessages: [
          {
            field: 'server',
            message: 'Failed to send recovery link',
          },
        ],
      }
    : undefined

  return (
    <Provider store={mockStore}>
      <ResendPasswordLinkRecovery email={props.email} oldRecoveryCode={props.oldRecoveryCode} resendError={mockError} />
    </Provider>
  )
}

const meta = {
  title: 'Features/Auth/ResendPasswordLinkRecovery',
  component: ResendWrapper,
  parameters: {
    layout: 'centered',
  },
  args: {
    email: 'user@example.com',
    oldRecoveryCode: 'expired-code-123',
    hasError: false,
  },
} satisfies Meta<typeof ResendWrapper>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithError: Story = {
  args: {
    hasError: true,
  },
}
