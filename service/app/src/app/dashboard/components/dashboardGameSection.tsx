"use client"

import { useState } from "react"
import { useIntersectionObserver } from "react-simplikit"

import { useGamePreview } from "@/entities/game/hooks/useGamePreview"
import { useInfiniteMyGames } from "@/entities/game/model/useInfiniteMyGames"
import * as GameCard from "@/entities/game/ui/GameCard/gameCard"
import { GameCardOptions } from "@/entities/game/ui/gameCardOptions"
import { GameCreate } from "@/entities/game/ui/gameCreate"
import { GameLibrarySkeleton } from "@/entities/game/ui/gameLibrarySkeleton"
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/images"

import { useDashboardGameActions } from "../hooks/useDashboardGameActions"

export const DashboardGameSection = () => {
  const [openMenuGameId, setOpenMenuGameId] = useState<string | null>(null)

  const { games, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteMyGames({
      limit: 19,
    })

  const loadMoreRef = useIntersectionObserver<HTMLDivElement>(
    (entry) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    },
  )

  const {
    handleCreateGame,
    handleEditGame,
    handleShareGame,
    handleDeleteGame,
    handleCopyLink,
    handleCloneGame,
  } = useDashboardGameActions()

  const { openPreview } = useGamePreview()

  return (
    <div className="mx-auto flex w-full max-w-[1130px] flex-col items-center px-10 pb-120 pt-[210px] sm:px-6 lg:px-0">
      <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-60">
        <div onClick={handleCreateGame} className="cursor-pointer">
          <GameCreate />
        </div>

        {isLoading && (!games || games.length === 0) && (
          <GameLibrarySkeleton count={19} />
        )}

        {games?.map((game) => (
          <div
            key={game.gameId}
            onClick={() => openPreview(game)}
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
              <GameCard.Options
                open={openMenuGameId === game.gameId}
                onOpenChange={(nextOpen) => {
                  setOpenMenuGameId(nextOpen ? game.gameId : null)
                }}
              >
                <GameCardOptions
                  shared={game.isShared}
                  onEdit={() => handleEditGame(game)}
                  onShare={() => handleShareGame(game)}
                  onDelete={() => handleDeleteGame(game)}
                  onCopyLink={() => handleCopyLink(game)}
                  onClone={() => handleCloneGame(game)}
                />
              </GameCard.Options>
            </GameCard.Root>
          </div>
        ))}

        {!isLoading && (games?.length ?? 0) === 0 && (
          <p className="col-span-full text-center text-text-secondary">
            등록된 게임이 없습니다.
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
