"use client"

import { GameCard } from "@shared/design/src/components/gameCard"
import { GameCardOptions } from "@shared/design/src/components/gameCard/gameCardOptions"
import { GameCreate } from "@shared/design/src/components/gameCreate"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { deleteGame } from "@/entities/game/api"
import type { GameListItem } from "@/entities/game/model"
import { useDashboardPopupActions } from "@/entities/game/model/useDashboardPopupActions"
import { useGameShareActions } from "@/entities/game/model/useGameShareActions"
import { queryClient } from "@/shared/lib/queryClient"
import { useIntersectionObserver } from "@/shared/lib/useIntersectionObserver"

interface GameLibraryGridProps {
  className?: string
  games?: GameListItem[]
  isFetchingNextPage?: boolean
  hasNextPage?: boolean
  onGameClick?: (game: GameListItem) => void
  onLoadMore?: () => void
  isDashboard?: boolean
}

export const GameLibraryGrid = ({
  className = "",
  games = [],
  isFetchingNextPage = false,
  hasNextPage = false,
  onGameClick,
  onLoadMore,
  isDashboard = false,
}: GameLibraryGridProps) => {
  const { showShareConfirm, showUnshareConfirm, showDeleteConfirm } =
    useDashboardPopupActions()
  const { shareGame: shareGameAction, unshareGame: unshareGameAction } =
    useGameShareActions()

  const setObserverRef = useIntersectionObserver({
    disabled: !hasNextPage || isFetchingNextPage || !onLoadMore,
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage && onLoadMore) {
        onLoadMore()
      }
    },
  })

  const router = useRouter()

  const handleCreateGame = () => {
    router.push("/create")
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
    <div className={`w-[1130px] ${className}`}>
      <div className="grid grid-cols-5 gap-60">
        <div className="flex justify-center">
          <GameCreate onClick={handleCreateGame} />
        </div>
        {games.map((game) => (
          <div
            key={game.gameId}
            onClick={() => onGameClick?.(game)}
            className="cursor-pointer"
          >
            <GameCard title={game.gameTitle}>
              <GameCard.Image>
                <Image
                  src={game.gameThumbnailUrl ?? "/checker.svg"}
                  alt={game.gameTitle}
                  fill
                  className="rounded-[10px] object-cover"
                  sizes="178px"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzI3IiBoZWlnaHQ9IjQ1OSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
                />
                <GameCard.Badge className="left-8 top-8">
                  {game.questionCount}문제
                </GameCard.Badge>
                {game.isShared && (
                  <GameCard.SharedBadge>공유</GameCard.SharedBadge>
                )}
              </GameCard.Image>
              {isDashboard ? (
                <div className="relative flex h-[46px] w-[178px] items-center justify-end">
                  <div
                    className="absolute left-6 line-clamp-2 h-[46px] w-[130px] shrink-0 overflow-hidden text-[19px] font-bold leading-[120%] text-text-primary"
                    data-testid="game-title"
                  >
                    {game.gameTitle}
                  </div>
                  <GameCardOptions
                    shared={game.isShared}
                    onEdit={() => handleEditGame(game)}
                    onShare={() => handleShareGame(game)}
                    onDelete={() => handleDeleteGame(game)}
                  />
                </div>
              ) : (
                <GameCard.Title>{game.gameTitle}</GameCard.Title>
              )}
            </GameCard>
          </div>
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="mt-60 flex w-full justify-center">
          <div className="grid grid-cols-5 gap-60">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`next-loading-${index}`}
                className="flex w-[178px] flex-col items-start gap-[14px]"
              >
                <div className="size-[178px] animate-pulse rounded-[10px] bg-gray-200" />
                <div className="h-[46px] w-[178px] animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      )}

      {hasNextPage && (
        <div
          ref={setObserverRef}
          className="mt-60 h-20 w-full"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
