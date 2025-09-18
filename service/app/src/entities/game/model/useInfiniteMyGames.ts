import { useInfiniteList } from "@/shared/lib/useInfiniteList"

import { getMyGames } from "../api"
import { GameListItem } from "./game"

export const useInfiniteMyGames = (params?: {
  limit?: number
  enabled?: boolean
}) =>
  useInfiniteList<
    GameListItem,
    { games: GameListItem[] },
    { cursorGameId?: string; cursorUpdatedAt?: string }
  >({
    queryKey: ["infiniteMyGames", { limit: params?.limit }],
    queryFn: async (pageParam) => {
      const response = await getMyGames({
        limit: params?.limit ?? 10,
        ...pageParam,
      })
      if (response.result !== "SUCCESS" || !response.data)
        throw new Error("Failed to fetch my games")
      return response.data
    },
    getNextPageParam: (lastPage) => {
      const games = lastPage.games
      if (games.length < (params?.limit ?? 10)) return undefined
      const lastGame = games[games.length - 1]
      return {
        cursorGameId: lastGame.gameId,
        cursorUpdatedAt: lastGame.updatedAt,
      }
    },
    enabled: params?.enabled,
  })
