import { PlayerStatus } from "@ject-5-fe/design/components/playerStatus"

import type { Team } from "../../store/useGameStore"

interface TeamSidebarProps {
  teams: Team[]
}

export function TeamSidebar({ teams }: TeamSidebarProps) {
  return (
    <aside className="flex h-full w-[420px] flex-col items-center gap-6 overflow-y-auto bg-background-tertiary px-[35px] pt-[25px]">
      {teams.map((team) => (
        <PlayerStatus
          key={team.id}
          name={team.name}
          score=""
          scoreView={false}
          className="h-[118px]"
        />
      ))}
    </aside>
  )
}
