"use client"

import { useAuth } from "@/entities/auth"

import { GameSection } from "../widgets/GameSection"
import { HeroSection } from "../widgets/HeroSection"
import { HomeNavigation } from "../widgets/HomeNavigation"

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <main className="min-h-screen bg-background-primary">
      <HomeNavigation isLoggedIn={isAuthenticated} />
      <div className="h-[157px]" />
      <HeroSection />
      <div className="h-[70px]" />
      <GameSection />
    </main>
  )
}
