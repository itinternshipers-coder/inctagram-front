'use client'

import { StoreProvider } from '@/shared/providers/StoreProvider'
import { ThemeProvider } from '@/shared/providers/ThemeProvider'
import { Header } from '@/widgets/header/Header'
import { Inter } from 'next/font/google'
import './globals.scss'
import React from 'react'

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
            <Header isLoginIn={true} />
            <main>{children}</main>
            <div id="portal-root"></div>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
