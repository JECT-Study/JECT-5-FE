"use client"

import { useRouter } from "next/navigation"
import { parseAsString, useQueryState } from "nuqs"
import { overlay } from "overlay-kit"

import { GameListItem } from "@/entities/game"
import { getGameDetail } from "@/entities/game/api/getGameDetail"
import { useInfiniteGameList } from "@/entities/game/model/useInfiniteGameList"
import { GameLibraryGrid } from "@/entities/game/ui/components"
import { GamePreview } from "@/entities/game/ui/components/gamePreview"

import { filterInput } from "../utils/filterInput"

export function GamesLibrarySection() {
  const router = useRouter()
  const [searchQuery] = useQueryState("query", parseAsString.withDefault(""))

  const { games, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteGameList({
      limit: 19,
      query: searchQuery || undefined,
    })

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const handleGameClick = async (game: GameListItem) => {
    try {
      const { data: gameDetail } = await getGameDetail(game.gameId)

      overlay.open(({ close, isOpen }) => {
        const handleStartGame = () => {
          close()
          router.push(`/game/${game.gameId}`)
        }

        return (
          <GamePreview
            gameTitle={gameDetail.gameTitle}
            creatorName={gameDetail.nickname}
            questionCount={gameDetail.questionCount}
            questions={gameDetail.questions.map((question) => ({
              id: question.questionId.toString(),
              title: question.questionText,
              imageUrl: question.imageUrl,
            }))}
            onClose={close}
            onStartGame={handleStartGame}
            isOpen={isOpen}
          />
        )
      })
    } catch (error) {
      console.error("Error fetching game detail:", error)
    }
  }

  const filteredGames = games?.filter((game) =>
    filterInput(game.gameTitle, searchQuery),
  )

  return (
    <div className="flex w-full flex-col items-center">
      <GameLibraryGrid
        games={filteredGames}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        onGameClick={handleGameClick}
        onLoadMore={handleLoadMore}
      />
    </div>
  )
}
