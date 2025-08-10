"use client"

import { ImageProvider } from "@shared/design/src/components/Image"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import NextImage from "next/image"
import { useState } from "react"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ImageProvider component={NextImage}>
        {children}
      </ImageProvider>
    </QueryClientProvider>
  )
}
