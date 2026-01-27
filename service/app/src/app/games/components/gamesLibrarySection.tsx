"use client"

import { parseAsString, useQueryState } from "nuqs"

import { useGamePreview } from "@/entities/game/hooks/useGamePreview"
import { useInfiniteGameList } from "@/entities/game/model/useInfiniteGameList"
import { GameLibraryGrid } from "@/entities/game/ui/gameLibraryGrid"

import { filterInput } from "../utils/filterInput"
import { GameCardActions } from "./gameCardActions"

export function GamesLibrarySection() {
  const [searchQuery] = useQueryState("query", parseAsString.withDefault(""))
  const { games, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteGameList({
      limit: 19,
      query: searchQuery || undefined,
    })

  const filteredGames = games?.filter((game) =>
    filterInput(game.gameTitle, searchQuery),
  )

  const { openPreview } = useGamePreview()

  return (
    <GameLibraryGrid
      games={filteredGames}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      onLoadMore={fetchNextPage}
      onGameClick={openPreview}
      emptyMessage="검색 결과가 없습니다."
      className="pb-120 pt-[210px]"
      renderMenuItems={(game) => <GameCardActions game={game} />}
    />
  )
}
