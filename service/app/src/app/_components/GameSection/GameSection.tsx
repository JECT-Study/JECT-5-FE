import { getDefaultGame } from "@/entities/game/api/getDefaultGame"

import { GameSectionClient } from "./GameSectionClient"
import { GameSectionHeader } from "./GameSectionHeader"

interface GameSectionProps {
  className?: string
}

export const GameSection = async ({ className = "" }: GameSectionProps) => {
  const response = await getDefaultGame({ cache: "force-cache" })
  const games = response.data.games

  return (
    <section
      className={`flex w-full flex-col items-center justify-center self-stretch p-0 ${className}`}
    >
      <div className="flex min-w-[952px] flex-col gap-28">
        <GameSectionHeader />
        <GameSectionClient games={games} />
      </div>
    </section>
  )
}
