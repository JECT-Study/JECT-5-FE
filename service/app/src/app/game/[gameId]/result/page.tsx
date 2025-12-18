"use client"

import { useRouter } from "next/navigation"

import { useGameEntryNavigation } from "@/entities/game/hooks/useGameEntryNavigation"

import { useGameStore } from "../store/useGameStore"
import { GameResultContent } from "./components/gameResultContent"
import { GameResultNavigation } from "./components/gameResultNavigation"

export default function GameResultPage() {
  const router = useRouter()
  const { teams, totalRounds, scores } = useGameStore((state) => state)

  const { goBackToEntry } = useGameEntryNavigation()

  const handleExit = () => {
    goBackToEntry()
  }

  return (
    <>
      <GameResultNavigation
        onExit={handleExit}
        onPreviousQuestion={() => router.push(`./play?q=${totalRounds}`)}
      />
      <GameResultContent teams={teams} scores={scores} />
    </>
  )
}
