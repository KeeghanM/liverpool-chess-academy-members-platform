import type { Metadata } from 'next'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './globals.css'
import { Header } from '@/components/header/header'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Members | Liverpool Chess Academy',
  description: 'Members of the Liverpool Chess Academy',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): JSX.Element {
  return (
    <html
      lang="en"
      data-theme="light"
    >
      <body>
        <Header />
        <Providers>
          <main className="flex min-h-screen flex-col items-center gap-12 p-24">
            {children}
          </main>
          <ReactQueryDevtools initialIsOpen={false} />
        </Providers>
      </body>
    </html>
  )
}
