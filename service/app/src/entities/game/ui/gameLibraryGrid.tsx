"use client"

import Link from "next/link"
import { type ReactNode, useState } from "react"
import { useIntersectionObserver } from "react-simplikit"

import type { GameListItem } from "@/entities/game/model"
import * as GameCard from "@/entities/game/ui/GameCard/gameCard"
import { GameCreate } from "@/entities/game/ui/gameCreate"
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/images"

import { GameLibrarySkeleton } from "./gameLibrarySkeleton"

interface GameLibraryGridProps {
  games?: GameListItem[]
  isLoading?: boolean
  isFetchingNextPage?: boolean
  hasNextPage?: boolean
  onLoadMore?: () => void
  onGameClick?: (game: GameListItem) => void
  renderMenuItems?: (game: GameListItem) => ReactNode
  showCreateButton?: boolean
  createButtonHref?: string
  emptyMessage?: string
  className?: string
}

export const GameLibraryGrid = ({
  games = [],
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onLoadMore,
  onGameClick,
  renderMenuItems,
  showCreateButton = false,
  createButtonHref = "/create",
  emptyMessage = "등록된 게임이 없습니다.",
  className = "",
}: GameLibraryGridProps) => {
  const [openMenuGameId, setOpenMenuGameId] = useState<string | null>(null)

  const loadMoreRef = useIntersectionObserver<HTMLDivElement>(
    (entry) => {
      if (
        entry.isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage &&
        onLoadMore
      ) {
        onLoadMore()
      }
    },
    {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    },
  )

  const isEmpty = !isLoading && games.length === 0

  return (
    <div
      className={`mx-auto flex w-full max-w-[1130px] flex-col items-center px-10 sm:px-6 lg:px-0 ${className}`}
    >
      <div className="grid w-full grid-cols-5 gap-10 lg:gap-60">
        {showCreateButton && (
          <Link href={createButtonHref} prefetch={true}>
            <GameCreate />
          </Link>
        )}

        {isLoading && games.length === 0 && <GameLibrarySkeleton count={19} />}

        {games.map((game) => (
          <div
            key={game.gameId}
            onClick={() => onGameClick?.(game)}
            className="cursor-pointer"
          >
            <GameCard.Root title={game.gameTitle}>
              <GameCard.Image
                src={game.gameThumbnailUrl || ""}
                alt={game.gameTitle}
                fill
                sizes="178px"
                placeholder="blur"
                blurDataURL={DEFAULT_BLUR_DATA_URL}
              >
                <GameCard.Badge>{game.questionCount}문제</GameCard.Badge>
                {game.isShared && (
                  <GameCard.Badge variant="bottom-left">공유</GameCard.Badge>
                )}
              </GameCard.Image>
              <GameCard.Description>{game.gameTitle}</GameCard.Description>
              {renderMenuItems && (
                <GameCard.Options
                  open={openMenuGameId === game.gameId}
                  onOpenChange={(nextOpen) => {
                    setOpenMenuGameId(nextOpen ? game.gameId : null)
                  }}
                >
                  {renderMenuItems(game)}
                </GameCard.Options>
              )}
            </GameCard.Root>
          </div>
        ))}

        {isEmpty && !showCreateButton && (
          <p className="col-span-full text-center text-text-secondary">
            {emptyMessage}
          </p>
        )}
      </div>

      {isFetchingNextPage && <GameLibrarySkeleton count={5} />}

      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="mt-[60px] h-[20px] w-full"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
