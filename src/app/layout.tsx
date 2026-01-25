import { AuthProvider } from '@/features/auth/providers/AuthProvider'
import { StoreProvider } from '@/shared/providers/StoreProvider'
import { ThemeProvider } from '@/shared/providers/ThemeProvider'
import { AuthWrapper } from '@/widgets/layout/AuthWrapper/AuthWrapper'
import { Inter } from 'next/font/google'
import React from 'react'
import './globals.scss'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-family-primary',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <StoreProvider>
          <ThemeProvider>
            <AuthProvider>
              <AuthWrapper>
                <main>{children}</main>
              </AuthWrapper>
            </AuthProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
