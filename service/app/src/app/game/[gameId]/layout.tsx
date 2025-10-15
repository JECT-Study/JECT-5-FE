import type { ReactNode } from "react"

import { getGameDetail } from "@/entities/game/api/getGameDetail"

import { GameProvider } from "./store/gameProvider"

export default async function GameLayout({
  params,
  children,
}: {
  params: { gameId: string }
  children: ReactNode
}) {
  const gameDetail = await getGameDetail(params.gameId)

  return (
    <GameProvider initialGameDetail={gameDetail.data} gameId={params.gameId}>
      <div className="flex h-screen w-screen flex-col bg-background-primary">
        {children}
      </div>
    </GameProvider>
  )
}
