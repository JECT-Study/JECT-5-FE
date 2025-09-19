"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
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

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <nav className={`flex h-[90px] items-center justify-end`}>
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
