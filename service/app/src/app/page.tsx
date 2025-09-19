import { ErrorBoundary } from "react-error-boundary"

import { GameSection } from "../widgets/GameSection"
import { HeroSection } from "../widgets/HeroSection"
import { HomeNavigation } from "../widgets/navigation/ui/homeNavigation"
import ErrorPage from "./error"

function HomeContent() {
  return (
    <main
      className="flex min-h-screen w-full flex-col items-start gap-[10.5vh] bg-background-primary p-0"
      role="main"
      aria-label="홈페이지"
    >
      <HomeNavigation />
      <HeroSection />
      <GameSection />
    </main>
  )
}

export default function Home() {
  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <HomeContent />
    </ErrorBoundary>
  )
}
