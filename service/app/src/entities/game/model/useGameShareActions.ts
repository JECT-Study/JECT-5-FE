"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

import { shareGame, unshareGame } from "@/entities/game/api"
import type { GameListItem } from "@/entities/game/model"

interface UseGameShareActionsReturn {
  shareGame: (game: GameListItem) => Promise<void>
  unshareGame: (game: GameListItem) => Promise<void>
}

export const useGameShareActions = (): UseGameShareActionsReturn => {
  const queryClient = useQueryClient()

  const handleShareGame = useCallback(
    async (game: GameListItem) => {
      try {
        const response = await shareGame(game.gameId)
        if (response.result === "SUCCESS") {
          console.log("Game shared successfully")
          // 내 게임 목록과 전체 게임 목록 모두 무효화
          queryClient.invalidateQueries({ queryKey: ["infiniteMyGames"] })
          queryClient.invalidateQueries({ queryKey: ["infiniteGameList"] })
        } else {
          console.error("Failed to share game")
          throw new Error("Failed to share game")
        }
      } catch (error) {
        console.error("Error sharing game:", error)
        throw error
      }
    },
    [queryClient],
  )

  const handleUnshareGame = useCallback(
    async (game: GameListItem) => {
      try {
        const response = await unshareGame(game.gameId)
        if (response.result === "SUCCESS") {
          console.log("Game unshared successfully")
          // 내 게임 목록과 전체 게임 목록 모두 무효화
          queryClient.invalidateQueries({ queryKey: ["infiniteMyGames"] })
          queryClient.invalidateQueries({ queryKey: ["infiniteGameList"] })
        } else {
          console.error("Failed to unshare game")
          throw new Error("Failed to unshare game")
        }
      } catch (error) {
        console.error("Error unsharing game:", error)
        throw error
      }
    },
    [queryClient],
  )

  return {
    shareGame: handleShareGame,
    unshareGame: handleUnshareGame,
  }
}
