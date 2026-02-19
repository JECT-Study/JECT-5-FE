"use client"

import {
  DestructiveSolidIconButton,
  PrimaryBoxButton,
} from "@ject-5-fe/design/components/button"
import * as TextField from "@ject-5-fe/design/components/textField"
import { Trash } from "@ject-5-fe/design/icons"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import { useShallow } from "zustand/react/shallow"

import { useGameStore } from "../../store/useGameStore"
import { generateTeamName } from "../../utils/generateTeamName"
import {
  canStartGame,
  getTeamErrors,
  MAX_TEAM_NAME_LENGTH,
  MAX_TEAMS,
  MIN_TEAMS,
} from "../../utils/teamValidation"

export function TeamInputForm() {
  const {
    teams,
    addTeam,
    removeTeam,
    updateTeamName,
    setGameStatus,
    resetScores,
  } = useGameStore(
    useShallow((state) => ({
      teams: state.teams,
      addTeam: state.addTeam,
      removeTeam: state.removeTeam,
      updateTeamName: state.updateTeamName,
      setGameStatus: state.setGameStatus,
      resetScores: state.resetScores,
    })),
  )
  const router = useRouter()

  const teamErrors = useMemo(() => getTeamErrors(teams), [teams])
  const isGameReady = useMemo(() => canStartGame(teams), [teams])

  const handleStartGame = () => {
    if (!isGameReady) return

    resetScores()
    setGameStatus("playing")
    router.push("./play")
  }

  return (
    <form
      className="flex size-full flex-col"
      onSubmit={(e) => {
        e.preventDefault()
        if (teams.length >= MAX_TEAMS) return

        addTeam({
          id: uuidv4(),
          name: generateTeamName(teams.length),
          members: [],
        })
      }}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-24 overflow-y-auto pb-24">
        {teams.map((team, index) => {
          const name = `team-${team.id}-${index}`
          const state = teamErrors[team.id] ? "error" : "default"
          return (
            <TextField.Root name={name} state={state} key={team.id}>
              <TextField.InputWrapper>
                <TextField.Input
                  value={team.name}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value.length > MAX_TEAM_NAME_LENGTH) return
                    updateTeamName(team.id, value.trim())
                  }}
                  maxLength={MAX_TEAM_NAME_LENGTH}
                />
                <DestructiveSolidIconButton
                  type="button"
                  aria-label="clear input"
                  onClick={() => {
                    if (teams.length > MIN_TEAMS) {
                      removeTeam(team.id)
                    }
                  }}
                >
                  <Trash />
                </DestructiveSolidIconButton>
              </TextField.InputWrapper>
              {teamErrors[team.id] && (
                <TextField.ErrorText>{teamErrors[team.id]}</TextField.ErrorText>
              )}
            </TextField.Root>
          )
        })}
      </div>
      <PrimaryBoxButton
        type="button"
        size="xl"
        _style="solid"
        className="mt-24 w-full shrink-0"
        disabled={!isGameReady}
        onClick={handleStartGame}
      >
        게임 시작하기
      </PrimaryBoxButton>
    </form>
  )
}
