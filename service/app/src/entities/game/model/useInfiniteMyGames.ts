"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useCallback, useRef } from "react"

import { getMyGames } from "@/entities/game/api"
import type { GameListItem } from "@/entities/game/model"

interface UseInfiniteMyGamesParams {
  limit?: number
  enabled?: boolean
}

interface UseInfiniteMyGamesReturn {
  games: GameListItem[]
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  fetchNextPage: () => void
  refetch: () => void
  error: Error | null
}

// 페이지 파라미터 타입 정의
type PageParam =
  | {
      cursorGameId?: string
      cursorUpdatedAt?: string
    }
  | undefined

export const useInfiniteMyGames = ({
  limit = 10,
  enabled = true,
}: UseInfiniteMyGamesParams = {}): UseInfiniteMyGamesReturn => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    error,
  } = useInfiniteQuery({
    queryKey: ["infiniteMyGames", { limit }] as const,
    queryFn: async ({ pageParam }: { pageParam: PageParam }) => {
      const params = {
        limit,
        ...pageParam,
      }

      const response = await getMyGames(params)

      if (response.result === "SUCCESS" && response.data) {
        return response.data
      }
      throw new Error("Failed to fetch my games")
    },
    initialPageParam: undefined as PageParam,
    getNextPageParam: (lastPage: { games: GameListItem[] }) => {
      const games = lastPage.games
      if (games.length < limit) {
        return undefined
      }

      const lastGame = games[games.length - 1]
      return {
        cursorGameId: lastGame.gameId,
        cursorUpdatedAt: lastGame.updatedAt,
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

  const games =
    data?.pages.flatMap((page: { games: GameListItem[] }) => page.games) ?? []

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
