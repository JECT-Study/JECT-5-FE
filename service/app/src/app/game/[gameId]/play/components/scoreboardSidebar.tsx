import { PrimarySolidIconButton } from "@ject-5-fe/design/components/button"
import { PlayerStatus } from "@ject-5-fe/design/components/playerStatus"
import { Hidden, Show } from "@ject-5-fe/design/icons"
import { cn } from "@ject-5-fe/design/utils/cn"
import { useState } from "react"

import type { Team } from "../../store/useGameStore"

interface ScoreboardSidebarProps {
  teams: Team[]
  scores: Record<string, number>
  onUpdateTeamScore: (teamId: string, score: number) => void
}

export const ScoreboardSidebar = ({
  teams,
  scores,
  onUpdateTeamScore,
}: ScoreboardSidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const clampScore = (value: number) => Math.max(-100, Math.min(100, value))

  return (
    <aside
      className={cn(
        "absolute left-20 top-20 flex w-full flex-col overflow-hidden rounded-20 bg-background-tertiary md:w-[330px] lg:w-[400px]",
        isSidebarOpen && "bottom-32",
      )}
    >
      <div className="relative flex shrink-0 items-center justify-center p-24">
        <span className="typography-heading-sm-extrabold">점수판</span>
        <PrimarySolidIconButton
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="점수판 토글"
          className="absolute right-24"
        >
          {isSidebarOpen ? <Show /> : <Hidden />}
        </PrimarySolidIconButton>
      </div>
      {isSidebarOpen && (
        <div className="flex min-h-0 flex-1 flex-col items-center gap-24 overflow-y-auto px-24 pb-24">
          {teams.map((team) => (
            <PlayerStatus
              key={team.id}
              name={team.name}
              score={`${scores[team.id]}점`}
              onScoreIncrease={() => {
                const newScore = clampScore(scores[team.id] + 1)
                onUpdateTeamScore(team.id, newScore)
              }}
              onScoreDecrease={() => {
                const newScore = clampScore(scores[team.id] - 1)
                onUpdateTeamScore(team.id, newScore)
              }}
              className="shrink-0"
            />
          ))}
        </div>
      )}
    </aside>
  )
}
