"use client"

import { useInfiniteQuery } from "@tanstack/react-query"

import { getGameList } from "@/entities/game/api"
import type { GameListData } from "@/entities/game/model"

interface UseInfiniteGameListParams {
  limit?: number
  query?: string
  enabled?: boolean
}

// interface UseInfiniteGameListReturn {
//   games: GameListItem[]
//   isLoading: boolean
//   isFetchingNextPage: boolean
//   hasNextPage: boolean
//   fetchNextPage: () => void
//   refetch: () => void
//   error: Error | null
// }

// 페이지 파라미터 타입 정의
// type PageParam =
//   | {
//       cursorGameId?: string
//       cursorPlayCount?: number
//       cursorUpdatedAt?: string
//     }
//   | undefined

export const useInfiniteGameList = ({
  limit = 10,
  query,
  enabled = true,
}: UseInfiniteGameListParams = {}) => {
  const {
    data: games,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    error,
  } = useInfiniteQuery({
    queryKey: ["infiniteGameList", { limit, query }] as const,
    queryFn: async ({ pageParam }) => {
      const params = {
        limit,
        query,
        ...pageParam,
      }
      const response = await getGameList(params)
      return response.data
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: GameListData) => {
      const games = lastPage.games
      if (games.length < limit) {
        return undefined
      }
      const lastGame = games[games.length - 1]
      return {
        cursorGameId: lastGame.gameId,
        cursorPlayCount: lastGame.playCount,
        cursorUpdatedAt: lastGame.updatedAt,
      }
    },
    enabled,
    select: (data) => data?.pages.flatMap((page) => page.games),
    placeholderData: (previousData) => previousData,
  })

  return {
    games,
    isLoading,
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    refetch,
    error,
  }
}
