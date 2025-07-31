"use client"

import {
  PrimaryBoxButton,
  SecondaryGhostIconButton,
  SecondaryPlainIconButton,
} from "@ject-5-fe/design/components/button"
import { CustomDialog } from "@ject-5-fe/design/components/dialog"
import * as InputComponents from "@ject-5-fe/design/components/input"
import { PlayerStatus } from "@ject-5-fe/design/components/playerStatus"
import { Cross, Sun } from "@ject-5-fe/design/icons"
import { produce } from "immer"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
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
    return "팀명을 비워둘 수 없어요."
  }
  if (name.length > MAX_TEAM_NAME_LENGTH) {
    return "팀명은 30자까지만 가능해요."
  }
  if (teams.some((team) => team.id !== teamId && team.name === name)) {
    return "이미 사용중인 팀명이에요."
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
  const params = useParams()
  const router = useRouter()
  const [teamState, setTeamState] = useState<TeamState>(
    createTeamState([
      { id: "1", name: "A팀" },
      { id: "2", name: "B팀" },
    ]),
  )
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false)

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
        const newId = String(draft.teams.length + 1)
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
      <div className="grid h-[110px] w-full grid-cols-[420px_1fr_420px] items-center bg-background-interactive-inverse px-10">
        <div>로고</div>

        <h1 className="typography-heading-lg-semibold whitespace-nowrap text-center text-text-primary">
          참가자 설정
        </h1>

        <div className="flex flex-col items-end justify-center gap-2.5">
          <div className="flex items-center justify-end gap-4 px-10">
            <SecondaryGhostIconButton>
              <Sun />
            </SecondaryGhostIconButton>
            <Link href={`/game/${params.gameId}/play`}>
              <PrimaryBoxButton
                size="sm"
                _style="solid"
                disabled={Object.keys(teamState.errors).length > 0}
              >
                게임 시작
              </PrimaryBoxButton>
            </Link>
            <SecondaryPlainIconButton
              size="lg"
              onClick={() => setIsExitDialogOpen(true)}
            >
              <Cross />
            </SecondaryPlainIconButton>
          </div>
        </div>
      </div>

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
                disabled={teamState.teams.length >= MAX_TEAMS}
              >
                참가자 및 팀 추가하기
              </PrimaryBoxButton>
            </InputComponents.Root>
          </div>
        </div>
      </section>

      <CustomDialog
        open={isExitDialogOpen}
        onOpenChange={setIsExitDialogOpen}
        title="게임을 나가시겠습니까?"
        description="진행 중인 게임이 종료됩니다."
        onConfirm={() => {
          setIsExitDialogOpen(false)
          router.push("/")
        }}
        onCancel={() => setIsExitDialogOpen(false)}
        confirmText="나가기"
        cancelText="취소"
      />
    </div>
  )
}
