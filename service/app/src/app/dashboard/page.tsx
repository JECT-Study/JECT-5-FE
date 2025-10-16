"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { overlay } from "overlay-kit"
import { useEffect, useState } from "react"

import { useAuthGuard } from "@/entities/auth/model/hooks/useAuthGuard"
import { GameListItem } from "@/entities/game"
import { deleteGame, getGameDetail } from "@/entities/game/api"
import { GameQuestion } from "@/entities/game/model/game"
import { useDashboardPopupActions } from "@/entities/game/model/useDashboardPopupActions"
import { useGameShareActions } from "@/entities/game/model/useGameShareActions"
import { useInfiniteMyGames } from "@/entities/game/model/useInfiniteMyGames"
import { GameLibraryGrid } from "@/entities/game/ui/components"
import { GamePreview } from "@/entities/game/ui/components/gamePreview"
import { DashboardNavigation } from "@/widgets/DashboardNavigation"

export default function DashboardPage() {
  useAuthGuard()

  const router = useRouter()
  const queryClient = useQueryClient()
  const [_searchQuery, _setSearchQuery] = useState("")

  const {
    games,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteMyGames({
    limit: 19,
  })

  const { showShareConfirm, showUnshareConfirm, showDeleteConfirm } =
    useDashboardPopupActions()
  const { shareGame: shareGameAction, unshareGame: unshareGameAction } =
    useGameShareActions()

  useEffect(() => {
    refetch()
  }, [refetch])

  const handleCreateGame = () => {
    router.push("/create")
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
            questions={gameDetail.questions.map((question: GameQuestion) => ({
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

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const handleEditGame = (game: GameListItem) => {
    router.push(`/create?gameId=${game.gameId}`)
  }

  const handleShareGame = (game: GameListItem) => {
    if (game.isShared) {
      showUnshareConfirm(game, async () => {
        try {
          await unshareGameAction(game)
        } catch (error) {
          console.error("Error unsharing game:", error)
        }
      })
    } else {
      showShareConfirm(game, async () => {
        try {
          await shareGameAction(game)
        } catch (error) {
          console.error("Error sharing game:", error)
        }
      })
    }
  }

  const handleDeleteGame = (game: GameListItem) => {
    showDeleteConfirm(game, async () => {
      try {
        const response = await deleteGame(game.gameId)
        if (response.result === "SUCCESS") {
          queryClient.invalidateQueries({ queryKey: ["infiniteMyGames"] })
        } else {
          console.error("Failed to delete game")
        }
      } catch (error) {
        console.error("Error deleting game:", error)
      }
    })
  }

  return (
    <main className="min-h-screen bg-background-primary">
      <DashboardNavigation />
      <div className="flex w-full flex-col items-center gap-[45px] pt-[40px]">
        <GameLibraryGrid
          games={games}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onCreateGame={handleCreateGame}
          onGameClick={handleGameClick}
          onLoadMore={handleLoadMore}
          isDashboard={true}
          onEditGame={handleEditGame}
          onShareGame={handleShareGame}
          onDeleteGame={handleDeleteGame}
        />
      </div>
    </main>
  )
}
