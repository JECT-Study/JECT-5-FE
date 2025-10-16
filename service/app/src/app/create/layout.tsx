"use client"

import { useSearchParams } from "next/navigation"
import type { ReactNode } from "react"
import { useEffect } from "react"

import { CreateGameProvider, gameStoreInstance } from "./store"

export default function CreateGameLayout({
  children,
}: {
  children: ReactNode
}) {
  const searchParams = useSearchParams()
  const gameId = searchParams.get("gameId")

  useEffect(() => {
    if (gameId) {
      const loadData = async () => {
        await gameStoreInstance.getState().loadGameData(gameId)
      }
      loadData()
    } else {
      gameStoreInstance.getState().reset()
    }
  }, [gameId])

  return <CreateGameProvider>{children}</CreateGameProvider>
}
