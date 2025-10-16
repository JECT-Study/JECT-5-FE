"use client"

import type { ReactNode } from "react"
import { useRef } from "react"
import { buildContext } from "react-simplikit"

import type { CreateGameStoreApi } from "./useCreateGameStore"
import { createGameStore } from "./useCreateGameStore"

const [CreateGameStoreProvider, useCreateGameStoreContext] =
  buildContext<CreateGameStoreApi>("CreateGameStore", {} as CreateGameStoreApi)

export interface CreateGameProviderProps {
  children: ReactNode
  gameId?: string | null
}

export const CreateGameProvider = ({
  children,
  gameId,
}: CreateGameProviderProps) => {
  const storeRef = useRef<CreateGameStoreApi | null>(null)

  if (storeRef.current === null) {
    storeRef.current = createGameStore(gameId || "default")
  }

  return (
    <CreateGameStoreProvider {...storeRef.current}>
      {children}
    </CreateGameStoreProvider>
  )
}

export { useCreateGameStoreContext }
