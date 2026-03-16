import { MockAuthProvider } from '@/shared/providers/MockAuthProvider'
import React from 'react'
import { StoreProvider } from '@/shared/providers/StoreProvider'
import { ThemeProvider } from '@/shared/providers/ThemeProvider'
import { Header } from '@/widgets/header/Header'
import Sidebar from '@/widgets/Sidebar/Sidebar'

export const ProfileLayoutDecorator = (Story: any, context: any) => {
  const isLoggedIn = context.args.isLoggedIn ?? true
  const mockUser = isLoggedIn
    ? { userId: '123', userName: 'Test User', email: 'test@example.com' }
    : null

  return (
    <StoreProvider>
      <ThemeProvider>
        <MockAuthProvider value={{ user: mockUser, isLoggedIn, isLoading: false, isFetching: false }}>
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar role="user" />
            <div style={{ flex: 1 }}>
              <Header isLoginIn={isLoggedIn} />
              <main style={{ padding: '24px' }}>
                <Story />
              </main>
            </div>
          </div>
        </MockAuthProvider>
      </ThemeProvider>
    </StoreProvider>
  )
}
