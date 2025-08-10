"use client"

import { useGameStore } from "../store/useGameStore"

interface PlayLayoutProps {
  children: React.ReactNode
}

export default function PlayLayout({ children }: PlayLayoutProps) {
  const gameStatus = useGameStore((state) => state.gameStatus)

  if (gameStatus !== "playing") {
    return null
  }

  return <>{children}</>
}
