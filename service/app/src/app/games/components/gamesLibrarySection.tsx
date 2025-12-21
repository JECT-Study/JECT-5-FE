"use client"

import { parseAsString, useQueryState } from "nuqs"
import { useIntersectionObserver } from "react-simplikit"

import { useGamePreview } from "@/entities/game/hooks/useGamePreview"
import { useInfiniteGameList } from "@/entities/game/model/useInfiniteGameList"
import { GameLibrarySkeleton } from "@/entities/game/ui/gameLibrarySkeleton"
import * as GameCard from "@/shared/gameCard"

import { filterInput } from "../utils/filterInput"
import { GameCardActions } from "./gameCardActions"

export function GamesLibrarySection() {
  const [searchQuery] = useQueryState("query", parseAsString.withDefault(""))
  const { games, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteGameList({
      limit: 19,
      query: searchQuery || undefined,
    })

  const intersectRef = useIntersectionObserver<HTMLDivElement>(
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

  const filteredGames = games?.filter((game) =>
    filterInput(game.gameTitle, searchQuery),
  )

  const { openPreview } = useGamePreview()

  return (
    <div className="mx-auto flex w-full max-w-[1130px] flex-col items-center px-10 sm:px-6 lg:px-0">
      <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-60">
        {isLoading && (!filteredGames || filteredGames.length === 0) && (
          <GameLibrarySkeleton count={19} />
        )}

        {filteredGames?.map((game) => (
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
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzI3IiBoZWlnaHQ9IjQ1OSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
              >
                <GameCard.Badge>{game.questionCount}문제</GameCard.Badge>
                {game.isShared && (
                  <GameCard.Badge variant="bottom-left">공유</GameCard.Badge>
                )}
              </GameCard.Image>
              <GameCard.Description>{game.gameTitle}</GameCard.Description>
              <GameCard.Options>
                <GameCardActions game={game} />
              </GameCard.Options>
            </GameCard.Root>
          </div>
        ))}

        {!isLoading && filteredGames?.length === 0 && (
          <p className="col-span-full text-center text-text-secondary">
            검색 결과가 없습니다.
          </p>
        )}
      </div>

      {isFetchingNextPage && <GameLibrarySkeleton count={5} />}

      {hasNextPage && (
        <div
          ref={intersectRef}
          className="mt-[60px] h-[20px] w-full"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
