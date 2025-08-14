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

/**
 * Provides game creation state to descendants and, when a `gameId` is given,
 * loads that game's details once to initialize the creation state.
 *
 * When `gameId` is provided, the provider performs a one-time client-side
 * fetch to `getGameDetail(gameId)`. On a successful response it calls
 * `gameCreation.actions.initializeFromGameDetail(...)` with the fetched title,
 * transformed questions (stringified `questionId`, `questionText`, `answer`, and
 * `imageUrl`), and version. While loading, the component renders a simple
 * loading message; after loading it renders the context provider with `children`.
 *
 * @param gameId - Optional external game identifier. If present, triggers a one-time
 *   initialization of the game creation state from the remote game detail.
 * @returns The GameCreationContext provider wrapping `children`, or a loading
 *   indicator while the game detail is being fetched.
 */
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
