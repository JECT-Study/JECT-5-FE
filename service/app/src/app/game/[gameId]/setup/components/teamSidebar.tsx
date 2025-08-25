"use client"

import { PlayerStatus } from "@ject-5-fe/design/components/playerStatus"

import { useGameStore } from "../../store/useGameStore"

export function TeamSidebar() {
  const teams = useGameStore((state) => state.teams)
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
