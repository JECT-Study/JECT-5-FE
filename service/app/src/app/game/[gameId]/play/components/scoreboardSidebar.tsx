import { PrimarySolidIconButton } from "@ject-5-fe/design/components/button"
import { PlayerStatus } from "@ject-5-fe/design/components/playerStatus"
import { Hidden, Show } from "@ject-5-fe/design/icons"
import { useState } from "react"

import type { Team } from "../../store/useGameStore"

interface ScoreboardSidebarProps {
  teams: Team[]
  onUpdateTeamScore: (teamId: string, score: number) => void
}

export const ScoreboardSidebar = ({
  teams,
  onUpdateTeamScore,
}: ScoreboardSidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const clampScore = (value: number) => Math.max(-100, Math.min(100, value))

  return (
    <div className="flex max-h-[940px] w-[400px] min-w-[400px] flex-col rounded-[20px] bg-background-tertiary px-24">
      <div className="relative flex items-center justify-center py-20">
        <span className="typography-heading-sm-bold w-full text-center text-text-primary">
          점수판
        </span>
        <PrimarySolidIconButton
          className="right-0 top-16"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="점수판 토글"
        >
          {isSidebarOpen ? <Show /> : <Hidden />}
        </PrimarySolidIconButton>
      </div>
      {isSidebarOpen && (
        <div className="flex max-h-[850px] flex-1 flex-col items-center gap-24 overflow-y-scroll pb-48">
          {teams.map((team) => (
            <PlayerStatus
              key={team.id}
              name={team.name}
              score={`${team.score}점`}
              onScoreIncrease={() => {
                const newScore = clampScore(team.score + 1)
                onUpdateTeamScore(team.id, newScore)
              }}
              onScoreDecrease={() => {
                const newScore = clampScore(team.score - 1)
                onUpdateTeamScore(team.id, newScore)
              }}
              className="min-h-[118px]"
            />
          ))}
        </div>
      )}
    </div>
  )
}
