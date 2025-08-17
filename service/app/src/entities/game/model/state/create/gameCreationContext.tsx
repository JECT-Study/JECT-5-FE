"use client"

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

import { getGameDetail } from "@/entities/game/api/getGameDetail"

import { useGameCreation } from "./useGameCreation"

type GameCreationContextType = ReturnType<typeof useGameCreation>

const GameCreationContext = createContext<GameCreationContextType | null>(null)

interface GameCreationProviderProps {
  children: ReactNode
  gameId?: string | null
}

export function GameCreationProvider({
  children,
  gameId,
}: GameCreationProviderProps) {
  const gameCreation = useGameCreation()
  const [isLoading, setIsLoading] = useState(false)
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (gameId && !hasLoaded.current) {
      hasLoaded.current = true
      setIsLoading(true)

      const loadGameData = async () => {
        try {
          const response = await getGameDetail(gameId)
          if (response.result === "SUCCESS" && response.data) {
            const gameDetail = response.data

            gameCreation.actions.initializeFromGameDetail(
              gameDetail.gameTitle,
              gameDetail.questions.map((question) => ({
                questionId: question.questionId.toString(),
                questionText: question.questionText,
                answer: question.questionAnswer,
                imageUrl: question.imageUrl,
              })),
              gameDetail.version,
            )
          }
        } catch (error) {
          console.error("Failed to load game data:", error)
        } finally {
          setIsLoading(false)
        }
      }

      loadGameData()
    }
  }, [gameId, gameCreation.actions])

  if (isLoading) {
    return <div>게임 데이터를 불러오는 중...</div>
  }

  return (
    <GameCreationContext.Provider value={gameCreation}>
      {children}
    </GameCreationContext.Provider>
  )
}

export function useGameCreationContext() {
  const context = useContext(GameCreationContext)
  if (!context) {
    throw new Error(
      "useGameCreationContext must be used within GameCreationProvider",
    )
  }
  return context
}
