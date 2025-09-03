import { QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { OverlayProvider } from "overlay-kit"

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
        enableSystem={false}
        enableColorScheme={false}
      >
        <OverlayProvider>
          <MSWProvider>{children}</MSWProvider>
        </OverlayProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
