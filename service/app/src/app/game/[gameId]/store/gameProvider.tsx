"use client"

import type { ReactNode } from "react"
import { useRef } from "react"
import { buildContext } from "react-simplikit"

import type { GameDetailData } from "@/entities/game/model"

import { createGameStore, type GameStoreApi } from "./useGameStore"

const [GameStoreProvider, useGameStoreContext] = buildContext<GameStoreApi>(
  "GameStore",
  {} as GameStoreApi,
)

export interface GameProviderProps {
  children: ReactNode
  initialGameDetail: GameDetailData
  gameId?: string
}

export const GameProvider = ({
  children,
  initialGameDetail,
  gameId,
}: GameProviderProps) => {
  const storeRef = useRef<GameStoreApi | null>(null)

  if (storeRef.current === null) {
    storeRef.current = createGameStore(initialGameDetail, gameId)
  }

  return <GameStoreProvider {...storeRef.current}>{children}</GameStoreProvider>
}

export { useGameStoreContext }
