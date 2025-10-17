"use client"

import * as TextField from "@ject-5-fe/design/components/textField"
import { Navigation } from "@shared/design/src/components/navigation"
import { Magnifier } from "@shared/design/src/icons"
import dynamic from "next/dynamic"
import { parseAsString, useQueryState } from "nuqs"

import { ThemeToggle } from "@/shared/themeToggleButton"

import { HomeButton } from "./components/homeButton"

const LoginButton = dynamic(() => import("@/shared/authButton"), {
  ssr: false,
})

interface GamesNavigationProps {
  className?: string
}

export const GamesNavigation = ({ className }: GamesNavigationProps) => {
  const [query, setQuery] = useQueryState(
    "query",
    parseAsString.withDefault(""),
  )

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value
    setQuery(nextValue ? nextValue : null)
  }

  return (
    <Navigation
      className={className}
      leftContent={<HomeButton />}
      centerContent={
        <TextField.Root name="game" className="w-full">
          <TextField.InputWrapper>
            <Magnifier className="size-32 text-icon-interactive-input-default" />
            <TextField.Input
              value={query}
              onChange={handleSearchChange}
              placeholder="오늘의 추천 게임은?"
            />
          </TextField.InputWrapper>
        </TextField.Root>
      }
      rightContent={
        <>
          <LoginButton />
          <ThemeToggle />
        </>
      }
    />
  )
}
