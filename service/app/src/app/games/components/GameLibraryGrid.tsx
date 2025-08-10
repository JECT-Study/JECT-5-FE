"use client"

import { GameCard } from "@shared/design/src/components/gameCard"
import { GameCreate } from "@shared/design/src/components/gameCreate"

import { GameListItem } from "@/entities/game"

interface GameLibraryGridProps {
  className?: string
  games?: GameListItem[]
  isLoading?: boolean
  onCreateGame?: () => void
  onGameClick?: (game: GameListItem) => void
}

export const GameLibraryGrid = ({
  className = "",
  games = [],
  isLoading = false,
  onCreateGame,
  onGameClick,
}: GameLibraryGridProps) => {
  return (
    <div className={`w-[1130px] ${className}`}>
      <div className="grid grid-cols-5 gap-[60px]">
        <div className="flex justify-center">
          <GameCreate onClick={onCreateGame} />
        </div>

        {isLoading
          ? Array.from({ length: 19 }).map((_, index) => (
              <div
                key={`loading-${index}`}
                className="flex w-[178px] flex-col items-start gap-[14px]"
              >
                <div className="size-[178px] animate-pulse rounded-[10px] bg-gray-200" />
                <div className="h-[46px] w-[178px] animate-pulse rounded bg-gray-200" />
              </div>
            ))
          : games.map((game) => (
              <div
                key={game.gameId}
                onClick={() => onGameClick?.(game)}
                className="cursor-pointer"
              >
                <GameCard
                  type="libraryGame"
                  title={game.gameTitle}
                  questionCount={game.questionCount}
                  imageUrl={game.gameThumbnailUrl}
                />
              </div>
            ))}
      </div>
    </div>
  )
} 