"use client"

import { PlayerStatus } from "@ject-5-fe/design/components/playerStatus"
import { v4 as uuidv4 } from "uuid"
import { useShallow } from "zustand/react/shallow"

import { FloatingAddButton } from "@/shared/ui/floatingAddButton"

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
      members: [],
    })
  }

  return (
    <aside className="absolute bottom-32 left-20 top-20 flex flex-col overflow-hidden rounded-20 bg-background-tertiary sm:w-[334px] md:w-[400px]">
      <div className="flex max-h-full flex-col items-center gap-24 overflow-y-auto px-24 pb-[140px] pt-28">
        {teams.map((team) => (
          <PlayerStatus
            key={team.id}
            name={team.name}
            score=""
            scoreView={false}
            className="shrink-0 py-40"
          />
        ))}
      </div>
      <FloatingAddButton
        onClick={handleAddTeam}
        ariaLabel="참가자 및 팀 추가하기"
        disabled={teams.length >= MAX_TEAMS}
      />
    </aside>
  )
}
