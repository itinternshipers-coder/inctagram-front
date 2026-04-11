import { AuthProvider } from '@/features/auth/providers/AuthProvider'
import { StoreProvider } from '@/shared/providers/StoreProvider'
import { ThemeProvider } from '@/shared/providers/ThemeProvider'
import { AuthWrapper } from '@/widgets/layout/AuthWrapper/AuthWrapper'
// import { Inter } from 'next/font/google'
import React from 'react'
import './globals.scss'

// const inter = Inter({
//   subsets: ['latin', 'cyrillic'],
//   weight: ['300', '400', '500', '600', '700'],
//   variable: '--font-family-primary',
// })

export default function RootLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <ThemeProvider>
            <AuthProvider>
              <AuthWrapper>
                <main>
                  {children}
                  {modal}
                </main>
              </AuthWrapper>
            </AuthProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
