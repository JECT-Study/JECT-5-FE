"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

import { useGameStore } from "../store/useGameStore"

interface PlayLayoutProps {
  children: React.ReactNode
}

export default function PlayLayout({ children }: PlayLayoutProps) {
  const router = useRouter()
  const params = useParams()
  const gameStatus = useGameStore((state) => state.gameStatus)

  useEffect(() => {
    if (gameStatus !== "playing") {
      router.replace(`/game/${params.gameId}/setup`)
    }
  }, [gameStatus, params.gameId, router])

  return <>{children}</>
}
