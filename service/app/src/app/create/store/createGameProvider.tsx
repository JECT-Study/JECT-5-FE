"use client"

import type { ReactNode } from "react"
import { buildContext } from "react-simplikit"

import type { CreateGameStoreApi } from "./useCreateGameStore"
import { gameStoreInstance } from "./useCreateGameStore"

const [CreateGameStoreProvider, useCreateGameStoreContext] =
  buildContext<CreateGameStoreApi>("CreateGameStore", {} as CreateGameStoreApi)

export interface CreateGameProviderProps {
  children: ReactNode
}

export const CreateGameProvider = ({ children }: CreateGameProviderProps) => {
  return (
    <CreateGameStoreProvider {...gameStoreInstance}>
      {children}
    </CreateGameStoreProvider>
  )
}

export { useCreateGameStoreContext }
