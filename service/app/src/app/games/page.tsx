"use client"

import { useRouter } from "next/navigation"

import { GameListItem } from "@/entities/game"

import { GameLibraryGrid } from "./components/GameLibraryGrid"

export default function GamesPage() {
  const router = useRouter()

  const handleCreateGame = () => {
    router.push("/create")
  }

  const handleGameClick = (game: GameListItem) => {
    router.push(`/game/${game.gameId}`)
  }

  const mockGames: GameListItem[] = []

  return (
    <main className="min-h-screen bg-background-primary">
      <div className="flex w-full flex-col items-center gap-[45px] pt-[40px]">        
        <GameLibraryGrid
          games={mockGames}
          onCreateGame={handleCreateGame}
          onGameClick={handleGameClick}
        />
      </div>
    </main>
  )
}
