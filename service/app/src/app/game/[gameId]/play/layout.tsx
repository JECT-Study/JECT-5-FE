"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

import { useGameStoreContext } from "../store/gameProvider"
import { useGameStore } from "../store/useGameStore"

interface PlayLayoutProps {
  children: React.ReactNode
}

export default function PlayLayout({ children }: PlayLayoutProps) {
  const router = useRouter()
  const params = useParams()
  const gameStatus = useGameStore((state) => state.gameStatus)
  const gameStoreApi = useGameStoreContext()

  useEffect(() => {
    // persist가 안 되었으면 redirect 판단하지 않음
    if (!gameStoreApi.persist.hasHydrated()) return

    if (gameStatus !== "playing") {
      router.replace(`/game/${params.gameId}/setup`)
    }
  }, [gameStatus, params.gameId, router, gameStoreApi.persist])

  // 렌더는 persist 여부와 gameStatus에 따라 결정
  if (!gameStoreApi.persist.hasHydrated() || gameStatus !== "playing") {
    return null
  }

  return <>{children}</>
}
