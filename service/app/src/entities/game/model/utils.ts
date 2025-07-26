import { GameListItem } from "./game"

export const sortGames = (games: GameListItem[]) => {
  return [...games].sort((a, b) => {
    if (a.playCount !== b.playCount) {
      return b.playCount - a.playCount
    }
    if (a.updatedAt && b.updatedAt)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    return 0
  })
}

export const findCursorPosition = (
  sortedGames: GameListItem[],
  cursorGameId?: string,
  cursorPlayCount?: string,
  cursorUpdatedAt?: string,
) => {
  if (!cursorGameId) return 0
  const cursorIndex = sortedGames.findIndex(
    (game) =>
      game.gameId === cursorGameId &&
      game.playCount === parseInt(cursorPlayCount || "0") &&
      game.updatedAt === cursorUpdatedAt,
  )
  return cursorIndex === -1 ? -1 : cursorIndex + 1
}

export const filterGamesByQuery = (games: GameListItem[], query?: string) => {
  // 삭제되지 않은 게임만 필터링
  const activeGames = games.filter((game) => !game.deletedAt)

  if (!query) return activeGames
  return activeGames.filter((game) =>
    game.gameTitle.toLowerCase().includes(query.toLowerCase()),
  )
}
