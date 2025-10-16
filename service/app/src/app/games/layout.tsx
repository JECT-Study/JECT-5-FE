import type { ReactNode } from "react"

interface GamesLayoutProps {
  children: ReactNode
}

export default function GamesLayout({ children }: GamesLayoutProps) {
  return <main className="min-h-screen bg-background-primary">{children}</main>
}
