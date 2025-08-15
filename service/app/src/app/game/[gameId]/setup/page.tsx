"use client"

import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"
import * as InputComponents from "@ject-5-fe/design/components/input"
import { useParams, useRouter } from "next/navigation"
import { useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import { useShallow } from "zustand/react/shallow"

import { openExitConfirmDialog } from "../components/dialogs/exitConfirmDialog"
import { type Team, useGameStore } from "../store/useGameStore"
import { GameNavigation } from "./components/gameNavigation"
import { TeamSidebar } from "./components/teamSidebar"

const MAX_TEAMS = 10
const MAX_TEAM_NAME_LENGTH = 30

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

export default function GameSetupPage() {
  const params = useParams()
  const router = useRouter()

  const { teams, addTeam, removeTeam, updateTeamName, setGameStatus } =
    useGameStore(
      useShallow((state) => ({
        teams: state.teams,
        addTeam: state.addTeam,
        removeTeam: state.removeTeam,
        updateTeamName: state.updateTeamName,
        setGameStatus: state.setGameStatus,
      })),
    )

  //팀에 대한 유효성 검사 - 전역 store에 추가하지 않고 관리
  const teamErrors = useMemo(
    () =>
      teams.reduce(
        (errors, team) => {
          const error = validateTeamName(team.id, team.name, teams)
          if (error) {
            errors[team.id] = error
          }
          return errors
        },
        {} as { [teamId: string]: string },
      ),
    [teams],
  )

  const handleUpdateTeamName = (teamId: string, name: string) => {
    if (name.length > MAX_TEAM_NAME_LENGTH) {
      return
    }
    updateTeamName(teamId, name)
  }

  const handleAddTeam = () => {
    if (teams.length >= MAX_TEAMS) {
      return
    }

    const newId = uuidv4()
    const newTeamName = `${String.fromCharCode(65 + teams.length)}팀`
    addTeam({
      id: newId,
      name: newTeamName,
      members: [],
    })
  }

  const handleRemoveTeam = (teamId: string) => {
    removeTeam(teamId)
  }

  const handleExitClick = () => {
    openExitConfirmDialog({
      onConfirm: () => router.push("/"),
    })
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-background-primary">
      <GameNavigation
        onStart={() => {
          setGameStatus("playing")
          router.push(`/game/${params.gameId}/play`)
        }}
        onExit={handleExitClick}
        canStart={Object.keys(teamErrors).length > 0}
      />
      <section className="flex flex-1 overflow-hidden">
        <TeamSidebar teams={teams} />
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <div className="flex max-h-full min-w-[452px] flex-col items-center justify-start overflow-y-auto">
            <InputComponents.Root
              className="flex w-full flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault()
                handleAddTeam()
              }}
            >
              {teams.map((team, index) => (
                <div key={team.id}>
                  <InputComponents.Field
                    name={`team-${team.id}-${index}`}
                    type="reset"
                    state={teamErrors[team.id] ? "error" : "default"}
                  >
                    <InputComponents.Control
                      value={team.name}
                      onChange={(value) => handleUpdateTeamName(team.id, value)}
                      onReset={() => {
                        if (teams.length > 2) {
                          handleRemoveTeam(team.id)
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
                </div>
              ))}
              <PrimaryBoxButton
                size="xl"
                _style="solid"
                disabled={teams.length >= MAX_TEAMS}
                onClick={handleAddTeam}
                type="button"
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
