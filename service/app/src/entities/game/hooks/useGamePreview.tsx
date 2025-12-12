"use client"

import { overlay } from "overlay-kit"
import { useCallback } from "react"

import type { GameListItem } from "@/entities/game"
import { getGameDetail } from "@/entities/game/api/getGameDetail"
import { GameQuestion } from "@/entities/game/model/game"
import { GamePreview } from "@/entities/game/ui/components/gamePreview"

import { useGameEntryNavigation } from "./useGameEntryNavigation"

interface UseGamePreviewParams {
  onError?: (error: unknown) => void
}

export const useGamePreview = ({ onError }: UseGamePreviewParams = {}) => {
  const { startGame } = useGameEntryNavigation()

  const openPreview = useCallback(
    async (game: GameListItem) => {
      try {
        const { data: gameDetail } = await getGameDetail(game.gameId)

        overlay.open(({ close, isOpen }) => {
          const handleStartGame = () => {
            close()
            startGame(game.gameId)
          }

          return (
            <GamePreview
              gameTitle={gameDetail.gameTitle}
              creatorName={gameDetail.nickname}
              questionCount={gameDetail.questionCount}
              questions={gameDetail.questions.map((question: GameQuestion) => ({
                id: question.questionId.toString(),
                title: question.questionText,
                imageUrl: question.imageUrl,
              }))}
              onClose={close}
              onStartGame={handleStartGame}
              isOpen={isOpen}
            />
          )
        })
      } catch (error) {
        console.error("Error fetching game detail:", error)
        onError?.(error)
      }
    },
    [onError, startGame],
  )

  return { openPreview }
}
