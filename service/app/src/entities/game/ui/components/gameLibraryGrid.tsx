"use client"

import { GameCreate } from "@ject-5-fe/design/components/gameCreate"
import { DropdownMenuItem } from "@ject-5-fe/design/components/menu"
import { Copy, Share } from "@ject-5-fe/design/icons"
import Link from "next/link"
import { useIntersectionObserver } from "react-simplikit"

import type { GameListItem } from "@/entities/game/model"
import * as GameCard from "@/shared/gameCard"

import { useActions } from "../../model/useGameCardActions"
import { GameLibrarySkeleton } from "./gameLibrarySkeleton"

interface GameLibraryGridProps {
  className?: string
  games?: GameListItem[]
  isLoading?: boolean
  isDashboard?: boolean
  isFetchingNextPage?: boolean
  hasNextPage?: boolean
  onCreateGame?: () => void
  onGameClick?: (game: GameListItem) => void
  onLoadMore?: () => void
  onEditGame?: (game: GameListItem) => void
  onShareGame?: (game: GameListItem) => void
  onDeleteGame?: (game: GameListItem) => void
  onCopyLinkGame?: (game: GameListItem) => void
  onCloneGame?: (game: GameListItem) => void
}

export const GameLibraryGrid = ({
  className = "",
  games = [],
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onGameClick,
  onLoadMore,
}: GameLibraryGridProps) => {
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

  const { copy, clone } = useActions()

  return (
    <div
      className={`mx-auto w-full max-w-[1130px] px-10 sm:px-6 lg:px-0 ${className}`}
    >
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-60">
        <Link href="/create" prefetch={true}>
          <GameCreate />
        </Link>

        {isLoading ? (
          <GameLibrarySkeleton count={19} />
        ) : (
          games.map((game) => (
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
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzI3IiBoZWlnaHQ9IjQ1OSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
                >
                  <GameCard.Badge>{game.questionCount}문제</GameCard.Badge>
                  {game.isShared && (
                    <GameCard.Badge variant="bottom-left">공유</GameCard.Badge>
                  )}
                </GameCard.Image>
                <GameCard.Description data-testid="game-title">
                  {game.gameTitle}
                </GameCard.Description>
                <GameCard.Options>
                  <DropdownMenuItem
                    type="icon"
                    onClick={(event) => {
                      event.stopPropagation()
                      const origin = window.location.origin
                      copy(`${origin}/game/${game.gameId}`)
                    }}
                    className="cursor-pointer"
                  >
                    <Share />
                    <span className="text-text-interactive-secondary">
                      링크 복사
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    type="icon"
                    onClick={(event) => {
                      event.stopPropagation()
                      clone(game.gameId)
                    }}
                    className="cursor-pointer"
                  >
                    <Copy />
                    <span className="text-text-interactive-secondary">
                      게임 복제
                    </span>
                  </DropdownMenuItem>
                </GameCard.Options>
              </GameCard.Root>
            </div>
          ))
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
