import type { Metadata } from 'next'
import { ApolloProvider } from '@/shared/providers/ApolloProvider'
import { ThemeProvider } from '@/shared/providers/ThemeProvider'
import './globals.scss'

export const metadata: Metadata = {
  title: 'Inctagram Admin',
  description: 'Admin panel for Inctagram',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <ThemeProvider>
          <ApolloProvider>{children}</ApolloProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
