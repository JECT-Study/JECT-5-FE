"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import * as TextField from "@shared/design/src/components/textField"
import { ThemeToggle } from "@shared/design/src/components/themeToggle"

import { useGameCreationContext } from "../../model/state/create/gameCreationContext"
import { RegisterButton } from "../interactions/registerButton"
import { SaveButton } from "../interactions/saveButton"

export function CreateGameNavigation() {
  const { state, actions, selectors } = useGameCreationContext()
  console.log(state)

  const handleGameNameChange = (value: string) => {
    actions.setGameName(value)
  }

  const handleGameNameFocus = () => {
    actions.setGameNameFocus(true)
  }

  const handleGameNameBlur = () => {
    actions.setGameNameFocus(false)
  }

  return (
    <nav
      className={`flex h-[110px] w-full items-center justify-between bg-background-tertiary px-10`}
    >
      <div className="flex w-[420px] items-center gap-2.5 bg-background-tertiary px-10">
        <TextField.Root
          name="gameTitle"
          state={selectors.gameNameError ? "error" : "default"}
        >
          <TextField.InputWrapper className="bg-background-interactive-input-primary">
            <TextField.Input
              placeholder="게임 이름 입력"
              value={state.gameName}
              onChange={(e) => handleGameNameChange(e.target.value)}
              onFocus={handleGameNameFocus}
              onBlur={handleGameNameBlur}
            />
          </TextField.InputWrapper>
          {selectors.gameNameError && (
            <TextField.ErrorText>{selectors.gameNameError}</TextField.ErrorText>
          )}
        </TextField.Root>
      </div>

      <div className="flex w-[420px] items-center justify-end gap-4 px-10">
        <ThemeToggle />

        <PrimaryBoxButton
          size="sm"
          _style="solid"
          disabled={!selectors.canAddQuestion}
          onClick={() =>
            actions.addQuestion(state.selectedQuestionId || undefined)
          }
        >
          문제 추가
        </PrimaryBoxButton>

        <SaveButton />

        <RegisterButton />
      </div>
    </nav>
  )
}
