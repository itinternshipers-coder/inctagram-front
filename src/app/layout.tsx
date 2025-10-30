import { Inter } from 'next/font/google'
import './globals.scss'
import PaginationPage from './(public)/pagination/page'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-family-primary',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} data-theme="dark">
      <body data-theme="dark">
        {children}
        <PaginationPage />
      </body>
    </html>
  )
}
