"use client"

import { Navigation } from "@shared/design/src/components/navigation"
import { useRouter } from "next/navigation"

import { GameSection } from "../widgets/GameSection"
import { HeroSection } from "../widgets/HeroSection"

export default function Home() {
  const router = useRouter()
  const isLoggedIn = false

  const handleHomeClick = () => {
    router.push("/")
  }

  const handleMyGamesClick = () => {
    router.push("/games")
  }

  const handleCreateGameClick = () => {
    router.push("/create")
  }

  const handleThemeToggle = () => {
  }

  const handleAvatarClick = () => {
  }

  const handleLoginClick = () => {
  }

  const navigationType = isLoggedIn ? "untitle-login" : "untitle-noLogin"

  return (
    <main className="min-h-screen bg-background-primary">
      <Navigation
        type={navigationType}
        playGame={false}
        onHomeClick={handleHomeClick}
        onMyGamesClick={handleMyGamesClick}
        onCreateGameClick={handleCreateGameClick}
        onLoginClick={handleLoginClick}
        onThemeToggle={handleThemeToggle}
        onAvatarClick={handleAvatarClick}
      />
      <div className="h-[157px]" />
      <HeroSection />
      <div className="h-[70px]" />
      <GameSection />
    </main>
  )
}
