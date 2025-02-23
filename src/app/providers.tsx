'use client'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function Providers({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  // eslint-disable-next-line -- hook-use-state, I don't want a setter here
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
