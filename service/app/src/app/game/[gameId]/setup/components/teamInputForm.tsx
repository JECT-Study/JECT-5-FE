"use client"

import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"
import * as InputComponents from "@ject-5-fe/design/components/input"
import { useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import { useShallow } from "zustand/react/shallow"

import { useGameStore } from "../../store/useGameStore"
import { generateTeamName } from "../../utils/generateTeamName"
import {
  getTeamErrors,
  MAX_TEAM_NAME_LENGTH,
  MAX_TEAMS,
  MIN_TEAMS,
} from "../../utils/teamValidation"

export function TeamInputForm() {
  const { teams, addTeam, removeTeam, updateTeamName } = useGameStore(
    useShallow((state) => ({
      teams: state.teams,
      addTeam: state.addTeam,
      removeTeam: state.removeTeam,
      updateTeamName: state.updateTeamName,
    })),
  )

  const teamErrors = useMemo(() => getTeamErrors(teams), [teams])

  return (
    <InputComponents.Root
      className="flex w-full flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (teams.length >= MAX_TEAMS) {
          return
        }

        addTeam({
          id: uuidv4(),
          name: generateTeamName(teams.length),
          score: 0,
          members: [],
        })
      }}
    >
      {teams.map((team, index) => (
        <InputComponents.Field
          name={`team-${team.id}-${index}`}
          type="reset"
          state={teamErrors[team.id] ? "error" : "default"}
          key={team.id}
        >
          <InputComponents.Control
            value={team.name}
            onChange={(value) => {
              if (value.length > MAX_TEAM_NAME_LENGTH) {
                return
              }
              updateTeamName(team.id, value)
            }}
            onReset={() => {
              if (teams.length > MIN_TEAMS) {
                removeTeam(team.id)
              }
            }}
            maxLength={MAX_TEAM_NAME_LENGTH}
            max={MAX_TEAM_NAME_LENGTH}
          />
          {teamErrors[team.id] && (
            <InputComponents.ErrorText>
              {teamErrors[team.id]}
            </InputComponents.ErrorText>
          )}
        </InputComponents.Field>
      ))}
      <PrimaryBoxButton
        size="xl"
        _style="solid"
        disabled={teams.length >= MAX_TEAMS}
      >
        참가자 및 팀 추가하기
      </PrimaryBoxButton>
    </InputComponents.Root>
  )
}
