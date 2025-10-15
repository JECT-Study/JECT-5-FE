"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useCallback, useRef } from "react"

import { getGameList } from "@/entities/game/api"
import type {
  GameListData,
  GameListItem,
  GameQueryParams,
} from "@/entities/game/model"

interface UseInfiniteGameListParams {
  limit?: number
  query?: string
  enabled?: boolean
}

interface UseInfiniteGameListReturn {
  games: GameListItem[]
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  fetchNextPage: () => void
  refetch: () => void
  error: Error | null
}

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
}: UseInfiniteGameListParams = {}): UseInfiniteGameListReturn => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    error,
  } = useInfiniteQuery({
    queryKey: ["infiniteGameList", { limit, query }] as const,
    queryFn: async ({ pageParam }) => {
      const params: GameQueryParams = {
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
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

  const games = data?.pages.flatMap((page: GameListData) => page.games) ?? []

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

export const useIntersectionObserver = (
  callback: () => void,
  options: IntersectionObserverInit = {},
) => {
  const observerRef = useRef<HTMLDivElement | null>(null)

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        callback()
      }
    },
    [callback],
  )

  const observer = useRef<IntersectionObserver | null>(null)

  const setObserverRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observer.current?.disconnect()
      }

      observerRef.current = node

      if (node) {
        observer.current = new IntersectionObserver(observerCallback, {
          root: null,
          rootMargin: "100px",
          threshold: 0.1,
          ...options,
        })
        observer.current.observe(node)
      }
    },
    [observerCallback, options],
  )

  return setObserverRef
}
