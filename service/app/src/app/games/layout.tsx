import type { ReactNode } from "react"

interface GamesLayoutProps {
  children: ReactNode
}

export default function GamesLayout({ children }: GamesLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col gap-120 bg-background-primary">
      {children}
    </main>
  )
}
