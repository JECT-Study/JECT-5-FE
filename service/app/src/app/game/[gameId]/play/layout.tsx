import GamePlayGuard from "./components/gamePlayGuard"
import HydrationWrapper from "./components/hydrationWrapper"

interface PlayLayoutProps {
  children: React.ReactNode
}

export default function PlayLayout({ children }: PlayLayoutProps) {
  return (
    <HydrationWrapper>
      <GamePlayGuard>{children}</GamePlayGuard>
    </HydrationWrapper>
  )
}
