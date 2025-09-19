"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import * as TextField from "@shared/design/src/components/textField"
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
      className={`flex h-[90px] w-full items-center justify-between bg-background-tertiary`}
    >
      <div className="flex items-center bg-background-tertiary px-10">
        <TextField.Root
          name="gameTitle"
          state={selectors.gameNameError ? "error" : "default"}
        >
          <TextField.InputWrapper className="flex min-h-[23px] w-80 min-w-[288px] shrink-0 items-center gap-2 bg-background-interactive-input-primary p-12 px-16">
            <TextField.Input
              placeholder="게임 이름 입력"
              value={state.gameName}
              onChange={(e) => handleGameNameChange(e.target.value)}
              onFocus={handleGameNameFocus}
              onBlur={handleGameNameBlur}
            />
          </TextField.InputWrapper>
        </TextField.Root>
      </div>

      <div className="flex items-center justify-center gap-16 px-10">
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
