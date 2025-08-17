"use client"

import {
  PrimaryBoxButton,
} from "@shared/design/src/components/button"
import { Control, Field, Root } from "@shared/design/src/components/input"
import { ErrorText } from "@shared/design/src/components/input"
import { ThemeToggle } from "@shared/design/src/components/themeToggle"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { useGameCreationContext } from "../../model/state/create/gameCreationContext"
import { RegisterButton } from "../interactions/registerButton"
import { SaveButton } from "../interactions/saveButton"

export function CreateGameNavigation() {
  const { state, actions, selectors } = useGameCreationContext()
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGameNameChange = (value: string) => {
    actions.setGameName(value)
  }

  const handleGameNameFocus = () => {
    actions.setGameNameFocus(true)
  }

  const handleGameNameBlur = () => {
    actions.setGameNameFocus(false)
  }

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <nav
      className={`flex h-[110px] w-full items-center justify-between bg-background-tertiary px-10`}
    >
      <div className="flex w-[420px] items-center gap-2.5 bg-background-tertiary px-10">
        <Root>
          <Field
            type="noIcon"
            state={selectors.gameNameError ? "error" : "default"}
            name="gameTitle"
            className="bg-background-interactive-input-primary"
          >
            <Control
              placeholder="게임 이름 입력"
              value={state.gameName}
              onChange={handleGameNameChange}
              onFocus={handleGameNameFocus}
              onBlur={handleGameNameBlur}
            />
            {selectors.gameNameError && (
              <ErrorText>{selectors.gameNameError}</ErrorText>
            )}
          </Field>
        </Root>
      </div>

      <div className="flex w-[420px] items-center justify-end gap-4 px-10">
        {mounted && (
          <ThemeToggle
            theme={(resolvedTheme as "dark" | "light") || "light"}
            onThemeToggle={handleThemeToggle}
          />
        )}

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
