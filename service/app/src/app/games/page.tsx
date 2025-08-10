"use client"

import { useRouter } from "next/navigation"

import { GameListItem } from "@/entities/game"
import { useInfiniteGameList } from "@/entities/game/model/useInfiniteGameList"
import { GameLibraryGrid } from "@/entities/game/ui/components"

export default function GamesPage() {
  const router = useRouter()

  const { games, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteGameList({
      limit: 19,
    })

  const handleCreateGame = () => {
    router.push("/create")
  }

  const handleGameClick = (game: GameListItem) => {
    router.push(`/game/${game.gameId}`)
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return (
    <main className="min-h-screen bg-background-primary">
      <div className="flex w-full flex-col items-center gap-[45px] pt-[40px]">
        <GameLibraryGrid
          games={games}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onCreateGame={handleCreateGame}
          onGameClick={handleGameClick}
          onLoadMore={handleLoadMore}
        />
      </div>
    </main>
  )
}
