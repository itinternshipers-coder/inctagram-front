import { Inter } from 'next/font/google'
import './globals.scss'
import Sidebar from '@/shared/ui/Sidebar/Sidebar'

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
        <Sidebar role="user" />
      </body>
    </html>
  )
}
