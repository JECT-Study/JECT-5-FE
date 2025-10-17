"use client"

import { GamesNavigation } from "@/widgets/GamesNavigation"

import { GamesLibrarySection } from "./components/gamesLibrarySection"

export default function GamesPage() {
  return (
    <>
      <GamesNavigation />
      <GamesLibrarySection />
    </>
  )
}
