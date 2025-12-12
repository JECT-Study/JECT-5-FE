"use client"

import { useRouter } from "next/navigation"

import { useGameEntryNavigation } from "@/entities/game/hooks/useGameEntryNavigation"

import { useGameStore } from "../store/useGameStore"
import { GameResultContent } from "./components/gameResultContent"
import { GameResultNavigation } from "./components/gameResultNavigation"

export default function GameResultPage() {
  const router = useRouter()
  const { teams, totalRounds } = useGameStore((state) => state)

  const { goBackToEntry } = useGameEntryNavigation()

  return (
    <>
      <GameResultNavigation
        onExit={goBackToEntry}
        onPreviousQuestion={() => router.push(`./play?q=${totalRounds - 1}`)}
      />
      <GameResultContent teams={teams} />
    </>
  )
}
