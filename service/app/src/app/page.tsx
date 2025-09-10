"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { useAuthStore } from "@/entities/auth"

import { GameSection } from "../widgets/GameSection"
import { HeroSection } from "../widgets/HeroSection"
import { HomeNavigation } from "../widgets/HomeNavigation"
import Error from "./error"
import HomeSkeleton from "./loading"

function HomeContent() {
  const { isAuthenticated } = useAuthStore()

  return (
    <main
      className="min-h-screen bg-background-primary"
      role="main"
      aria-label="홈페이지"
    >
      <HomeNavigation isLoggedIn={isAuthenticated} />
      <div className="h-[157px]" />
      <HeroSection />
      <div className="h-[70px]" />
      <GameSection />
    </main>
  )
}

export default function Home() {
  return (
    <ErrorBoundary FallbackComponent={Error}>
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent />
      </Suspense>
    </ErrorBoundary>
  )
}
