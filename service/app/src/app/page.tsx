import { GameSection } from "@/app/_components/GameSection/GameSection"
import { HeroSection } from "@/app/_components/HeroSection"
import { HomeNavigation } from "@/widgets/HomeNavigation"

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background-primary">
      <HomeNavigation />
      <div className="flex flex-col gap-56">
        <HeroSection />
        <GameSection />
      </div>
    </main>
  )
}

export const dynamic = "force-dynamic"
