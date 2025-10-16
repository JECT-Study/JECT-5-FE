"use client"

import { useSearchParams } from "next/navigation"
import type { ReactNode } from "react"
import { useEffect } from "react"
import { buildContext } from "react-simplikit"

import type { CreateGameStoreApi } from "./useCreateGameStore"
import { gameStoreInstance } from "./useCreateGameStore"

const [CreateGameStoreProvider, useCreateGameStoreContext] =
  buildContext<CreateGameStoreApi>("CreateGameStore", {} as CreateGameStoreApi)

export interface CreateGameProviderProps {
  children: ReactNode
}

export const CreateGameProvider = ({ children }: CreateGameProviderProps) => {
  const searchParams = useSearchParams()
  const gameId = searchParams.get("gameId")

  useEffect(() => {
    if (gameId) {
      const loadData = async () => {
        await gameStoreInstance.getState().loadGameData(gameId)
      }
      loadData()
    }
  }, [gameId])

  return (
    <CreateGameStoreProvider {...gameStoreInstance}>
      {children}
    </CreateGameStoreProvider>
  )
}

export { useCreateGameStoreContext }
