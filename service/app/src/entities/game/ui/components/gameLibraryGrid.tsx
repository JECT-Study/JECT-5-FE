"use client"

import { GameCard } from "@shared/design/src/components/gameCard"
import { GameCardOptions } from "@shared/design/src/components/gameCard/gameCardOptions"
import { GameCreate } from "@shared/design/src/components/gameCreate"
import Image from "next/image"

import type { GameListItem } from "@/entities/game/model"
import { useIntersectionObserver } from "@/entities/game/model/useInfiniteGameList"

interface GameLibraryGridProps {
  className?: string
  games?: GameListItem[]
  isLoading?: boolean
  isFetchingNextPage?: boolean
  hasNextPage?: boolean
  onCreateGame?: () => void
  onGameClick?: (game: GameListItem) => void
  onLoadMore?: () => void
  isDashboard?: boolean
  onEditGame?: (game: GameListItem) => void
  onShareGame?: (game: GameListItem) => void
  onDeleteGame?: (game: GameListItem) => void
}

export const GameLibraryGrid = ({
  className = "",
  games = [],
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onCreateGame,
  onGameClick,
  onLoadMore,
  isDashboard = false,
  onEditGame,
  onShareGame,
  onDeleteGame,
}: GameLibraryGridProps) => {
  const setObserverRef = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage && onLoadMore) {
      onLoadMore()
    }
  })

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
                <GameCard>
                  <GameCard.Image>
                    {game.gameThumbnailUrl ? (
                      <Image
                        src={game.gameThumbnailUrl}
                        alt={game.gameTitle}
                        fill
                        className="rounded-[10px] object-cover"
                        sizes="178px"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzI3IiBoZWlnaHQ9IjQ1OSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center rounded-[10px] bg-gray-200">
                        <span className="text-[14px] font-medium text-gray-500">
                          이미지 없음
                        </span>
                      </div>
                    )}
                    <GameCard.Badge className="left-[8px] top-[8px]">
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
                      <div className="absolute right-0 top-[11px]">
                        <GameCardOptions
                          shared={game.isShared}
                          onEdit={() => onEditGame?.(game)}
                          onShare={() => onShareGame?.(game)}
                          onDelete={() => onDeleteGame?.(game)}
                        />
                      </div>
                    </div>
                  ) : (
                    <GameCard.Title>{game.gameTitle}</GameCard.Title>
                  )}
                </GameCard>
              </div>
            ))}
      </div>

      {isFetchingNextPage && (
        <div className="mt-[60px] flex w-full justify-center">
          <div className="grid grid-cols-5 gap-[60px]">
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
          className="mt-[60px] h-[20px] w-full"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
