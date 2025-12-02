'use client'

import { StoreProvider } from '@/shared/providers/StoreProvider'
import { ThemeProvider } from '@/shared/providers/ThemeProvider'
import { Header } from '@/widgets/header/Header'
import { Inter } from 'next/font/google'
import './globals.scss'
import React from 'react'
import { AuthWrapper } from '@/widgets/layout/AuthWrapper/AuthWrapper'

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
            <AuthWrapper>
              <main>{children}</main>
            </AuthWrapper>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
