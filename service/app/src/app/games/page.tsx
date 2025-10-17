"use client"

import { Suspense } from "react"

import { GamesNavigation } from "@/widgets/GamesNavigation"

import { GamesLibrarySection } from "./components/gamesLibrarySection"
//useSearchParams를 내부적으로 사용하고 있어 이를 위해서만 Suspense 사용

export default function GamesPage() {
  return (
    <>
      <Suspense fallback={null}>
        <GamesNavigation />
      </Suspense>
      <Suspense fallback={null}>
        <GamesLibrarySection />
      </Suspense>
    </>
  )
}
