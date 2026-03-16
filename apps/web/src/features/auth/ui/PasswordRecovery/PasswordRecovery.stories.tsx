import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Provider } from 'react-redux'
import { baseApi } from '@/shared/api/base-api'
import { configureStore } from '@reduxjs/toolkit'
import { PasswordRecovery } from './PasswordRecovery'

const mockStore = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

interface PasswordRecoveryWrapperProps {
  recoveryCode: string
  email: string
  hasData: boolean
  hasError: boolean
}

const PasswordRecoveryWrapper = (props: PasswordRecoveryWrapperProps) => {
  const mockData = props.hasData ? { message: 'Recovery code is valid' } : undefined

  const mockError = props.hasError
    ? {
        errorsMessages: [
          {
            field: 'recoveryCode',
            message: 'Recovery code is invalid or expired',
          },
        ],
      }
    : undefined

  return (
    <Provider store={mockStore}>
      <PasswordRecovery recoveryCode={props.recoveryCode} email={props.email} data={mockData} error={mockError} />
    </Provider>
  )
}

const meta = {
  title: 'Features/Auth/PasswordRecovery',
  component: PasswordRecoveryWrapper,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PasswordRecoveryWrapper>

export default meta

type Story = StoryObj<typeof meta>

export const ValidCode: Story = {
  args: {
    recoveryCode: 'valid-code-123',
    email: 'user@example.com',
    hasData: true,
    hasError: false,
  },
}

export const InvalidCode: Story = {
  args: {
    recoveryCode: 'invalid-code-456',
    email: 'user@example.com',
    hasData: false,
    hasError: true,
  },
}
