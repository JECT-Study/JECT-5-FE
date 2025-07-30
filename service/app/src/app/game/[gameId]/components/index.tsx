"use client"

import {
  PrimaryBoxButton,
  SecondaryGhostIconButton,
  SecondaryPlainIconButton,
} from "@ject-5-fe/design/components/button"
import * as InputComponents from "@ject-5-fe/design/components/input"
import { PlayerStatus } from "@ject-5-fe/design/components/playerStatus"
import { Cross, Sun } from "@ject-5-fe/design/icons"
import { produce } from "immer"
import { useState } from "react"

interface Team {
  id: string
  name: string
}

interface TeamState {
  teams: Team[]
  errors: { [teamId: string]: string }
}

const MAX_TEAMS = 10
const MAX_TEAM_NAME_LENGTH = 30

const createTeamState = (initialTeams: Team[] = []): TeamState => ({
  teams: initialTeams,
  errors: {},
})

const validateTeamName = (
  teamId: string,
  name: string,
  teams: Team[],
): string => {
  if (name.length === 0) {
    return "팀명을 입력해주세요"
  }
  if (name.length > MAX_TEAM_NAME_LENGTH) {
    return "팀 이름이 너무 깁니다."
  }
  if (teams.some((team) => team.id !== teamId && team.name === name)) {
    return "중복된 팀 이름입니다."
  }
  return ""
}

const updateTeamErrors = (teams: Team[]): { [teamId: string]: string } => {
  const errors: { [teamId: string]: string } = {}
  teams.forEach((team) => {
    const error = validateTeamName(team.id, team.name, teams)
    if (error) {
      errors[team.id] = error
    }
  })
  return errors
}

export default function GameSetupPage() {
  const [teamState, setTeamState] = useState<TeamState>(
    createTeamState([
      { id: "1", name: "A팀" },
      { id: "2", name: "B팀" },
    ]),
  )

  const updateTeamName = (teamId: string, name: string) => {
    if (name.length > MAX_TEAM_NAME_LENGTH) {
      return
    }

    setTeamState(
      produce((draft) => {
        const teamIndex = draft.teams.findIndex((team) => team.id === teamId)
        if (teamIndex !== -1) {
          draft.teams[teamIndex].name = name
          draft.errors = updateTeamErrors(draft.teams)
        }
      }),
    )
  }

  const addTeam = () => {
    if (teamState.teams.length >= MAX_TEAMS) {
      return
    }

    setTeamState(
      produce((draft) => {
        const newId = String(Date.now())
        const newTeamName = `${String.fromCharCode(65 + draft.teams.length)}팀`
        draft.teams.push({ id: newId, name: newTeamName })
        draft.errors = updateTeamErrors(draft.teams)
      }),
    )
  }

  const removeTeam = (teamId: string) => {
    setTeamState(
      produce((draft) => {
        draft.teams = draft.teams.filter((team) => team.id !== teamId)
        draft.errors = updateTeamErrors(draft.teams)
      }),
    )
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-background-primary">
      {/* Navigation */}
      <div className="flex h-[110px] w-full items-center justify-between bg-background-primary">
        <div className="flex w-[420px] items-center gap-2.5 bg-background-tertiary px-10">
          <div className="flex h-[60px] w-[268px] items-center justify-center">
            <div className="size-8 bg-icon-interactive-primary" />
          </div>
        </div>

        <h1 className="typography-heading-lg-semibold text-text-primary">
          참가자 설정
        </h1>

        <div className="flex w-[420px] flex-col items-end justify-center gap-2.5">
          <div className="flex items-center justify-end gap-4 px-10">
            <SecondaryGhostIconButton>
              <Sun />
            </SecondaryGhostIconButton>
            <PrimaryBoxButton
              size="sm"
              _style="solid"
              disabled={Object.keys(teamState.errors).length > 0}
            >
              게임 시작
            </PrimaryBoxButton>
            <SecondaryPlainIconButton size="lg">
              <Cross />
            </SecondaryPlainIconButton>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Team List */}
        <div className="flex h-full w-[420px] flex-col gap-6 overflow-y-auto bg-background-tertiary px-[35px] pt-[25px]">
          {teamState.teams.map((team) => (
            <PlayerStatus
              key={team.id}
              name={team.name}
              score=""
              scoreView={false}
              className="h-[118px]"
            />
          ))}
        </div>

        {/* Right Content - Team Management */}
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <div className="flex max-h-full min-w-[452px] flex-col items-center justify-start overflow-y-auto">
            {/* Team Input Fields */}
            <InputComponents.Root
              className="flex w-full flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault()
                addTeam()
              }}
            >
              {teamState.teams.map((team) => (
                <div key={team.id}>
                  <InputComponents.Field
                    name={`team-${team.id}`}
                    type="reset"
                    state={teamState.errors[team.id] ? "error" : "default"}
                  >
                    <InputComponents.Control
                      value={team.name}
                      onChange={(value) => updateTeamName(team.id, value)}
                      onReset={() => {
                        if (teamState.teams.length > 2) {
                          removeTeam(team.id)
                        }
                      }}
                      maxLength={MAX_TEAM_NAME_LENGTH}
                      max={MAX_TEAM_NAME_LENGTH}
                    />
                    {teamState.errors[team.id] && (
                      <InputComponents.ErrorText>
                        {teamState.errors[team.id]}
                      </InputComponents.ErrorText>
                    )}
                  </InputComponents.Field>
                </div>
              ))}
              {/* Add Team Button */}
              <PrimaryBoxButton
                size="xl"
                _style="solid"
                // onClick={addTeam}
                disabled={teamState.teams.length >= MAX_TEAMS}
              >
                참가자 및 팀 추가하기
              </PrimaryBoxButton>
            </InputComponents.Root>
          </div>
        </div>
      </section>
    </div>
  )
}
