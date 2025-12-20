import { GameSection } from "@/widgets/GameSection"
import { HeroSection } from "@/widgets/HeroSection"
import { HomeNavigation } from "@/widgets/HomeNavigation"

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-start gap-112 bg-background-primary">
      <HomeNavigation />
      <HeroSection />
      <GameSection />
    </main>
  )
}
