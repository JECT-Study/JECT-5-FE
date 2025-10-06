"use client"

import { ErrorBoundary } from "react-error-boundary"

import { useAuthStore } from "@/entities/auth"

import { GameSection } from "../widgets/GameSection"
import { HeroSection } from "../widgets/HeroSection"
import { HomeNavigation } from "../widgets/HomeNavigation"
import ErrorPage from "./error"

function HomeContent() {
  const { isAuthenticated } = useAuthStore()

  return (
    <main className="flex min-h-screen w-full flex-col items-start gap-[10.5vh] bg-background-primary p-0">
      <HomeNavigation isLoggedIn={isAuthenticated} />
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
