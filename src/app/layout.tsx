'use client'

import { Button } from '@/shared/ui/Button/Button'
import { Inter } from 'next/font/google'
import './globals.scss'
import { useEffect } from 'react'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-family-primary',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children} <ThemeToggle />
      </body>
    </html>
  )
}

// временно, пока не добавим переключатель в хедер
const ThemeToggle = () => {
  const toggleTheme = () => {
    const html = document.documentElement
    const currentTheme = html.getAttribute('data-theme')
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

    html.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme) // Сохраняем выбор
  }

  return (
    <Button onClick={toggleTheme} style={{ margin: '10px auto' }}>
      🌙/☀️
    </Button>
  )
}
