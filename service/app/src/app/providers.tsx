"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { OverlayProvider } from "overlay-kit"

import { AuthProvider } from "@/entities/auth/ui/authProvider"
import { MSWProvider } from "@/mocks/mswProvider"
import { queryClient } from "@/shared/lib/queryClient"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={true}
        enableColorScheme={true}
      >
        <OverlayProvider>
          <MSWProvider>
            <AuthProvider>
              <NuqsAdapter>{children}</NuqsAdapter>
            </AuthProvider>
          </MSWProvider>
        </OverlayProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
