"use client"

import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"
import { PlayerStatus } from "@ject-5-fe/design/components/playerStatus"
import { StickyActionBar } from "@ject-5-fe/design/components/stickyActionBar"
import { v4 as uuidv4 } from "uuid"
import { useShallow } from "zustand/react/shallow"

import { useGameStore } from "../../store/useGameStore"
import { generateTeamName } from "../../utils/generateTeamName"
import { MAX_TEAMS } from "../../utils/teamValidation"

export function TeamSidebar() {
  const { teams, addTeam } = useGameStore(
    useShallow((state) => ({
      teams: state.teams,
      addTeam: state.addTeam,
    })),
  )

  const handleAddTeam = () => {
    if (teams.length >= MAX_TEAMS) return

    addTeam({
      id: uuidv4(),
      name: generateTeamName(teams.length),
      score: 0,
      members: [],
    })
  }

  return (
    <aside className="flex h-full w-[420px] flex-col overflow-hidden bg-background-tertiary pt-[25px]">
      <div className="flex min-h-0 flex-1 flex-col items-stretch gap-6 overflow-y-auto px-[35px] pb-28">
        {teams.map((team) => (
          <PlayerStatus
            key={team.id}
            name={team.name}
            score=""
            scoreView={false}
            className="h-[118px] shrink-0"
          />
        ))}
      </div>
      <StickyActionBar className="mt-auto" contentClassName="w-full">
        <PrimaryBoxButton
          type="button"
          size="xl"
          _style="solid"
          className="w-full"
          disabled={teams.length >= MAX_TEAMS}
          onClick={handleAddTeam}
        >
          참가자 및 팀 추가하기
        </PrimaryBoxButton>
      </StickyActionBar>
    </aside>
  )
}
