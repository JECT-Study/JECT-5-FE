"use client"

import { useGamePreview } from "@/entities/game/hooks/useGamePreview"
import { useInfiniteMyGames } from "@/entities/game/model/useInfiniteMyGames"
import { GameCardOptions } from "@/entities/game/ui/gameCardOptions"
import { GameLibraryGrid } from "@/entities/game/ui/gameLibraryGrid"

import { useAdminGameActions } from "../hooks/useAdminGameActions"

export const AdminGameSection = () => {
  const { games, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteMyGames({
      limit: 19,
    })

  const {
    handleEditGame,
    handleShareGame,
    handleDeleteGame,
    handleCopyLink,
    handleCloneGame,
  } = useAdminGameActions()

  const { openPreview } = useGamePreview()

  return (
    <GameLibraryGrid
      games={games}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      onLoadMore={fetchNextPage}
      onGameClick={openPreview}
      showCreateButton
      createButtonHref="/create"
      emptyMessage="등록된 게임이 없습니다."
      className="pb-120 pt-[120px]"
      renderMenuItems={(game) => (
        <GameCardOptions
          shared={game.isShared}
          onEdit={() => handleEditGame(game)}
          onShare={() => handleShareGame(game)}
          onDelete={() => handleDeleteGame(game)}
          onCopyLink={() => handleCopyLink(game)}
          onClone={() => handleCloneGame(game)}
        />
      )}
    />
  )
}
