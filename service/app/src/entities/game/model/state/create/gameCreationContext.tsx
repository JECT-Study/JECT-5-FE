"use client"

import { createContext, ReactNode, useContext } from "react"

import { useGameCreation } from "./useGameCreation"

type GameCreationContextType = ReturnType<typeof useGameCreation>

const GameCreationContext = createContext<GameCreationContextType | null>(null)

export function GameCreationProvider({ children }: { children: ReactNode }) {
  const gameCreation = useGameCreation()

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
