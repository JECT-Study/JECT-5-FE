import type { ReactNode } from "react"

import { getGameDetail } from "@/entities/game/api/getGameDetail"

import { GameStoreProvider } from "./store/useGameStore"

export default async function GameLayout({
  params,
  children,
}: {
  params: { gameId: string }
  children: ReactNode
}) {
  const gameDetail = await getGameDetail(params.gameId)
  if (gameDetail.result === "ERROR" || !gameDetail.data) {
    return <div>게임을 찾을 수 없습니다: {gameDetail.error?.message}</div>
  }

  return (
    <GameStoreProvider initialGameDetail={gameDetail.data}>
      {children}
    </GameStoreProvider>
  )
}
