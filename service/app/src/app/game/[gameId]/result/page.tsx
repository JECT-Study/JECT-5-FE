"use client"

import { useRouter } from "next/navigation"

import { useGameStore } from "../store/useGameStore"
import { GameResultContent } from "./components/gameResultContent"
import { GameResultNavigation } from "./components/gameResultNavigation"

export default function GameResultPage() {
  const router = useRouter()
  const { teams, totalRounds } = useGameStore((state) => state)

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <>
      <GameResultNavigation
        onGoHome={handleGoHome}
        onPreviousQuestion={() => router.push(`./play?q=${totalRounds - 1}`)}
      />
      <GameResultContent teams={teams} />
    </>
  )
}
