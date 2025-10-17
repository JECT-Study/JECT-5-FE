"use client"

import { Navigation } from "@ject-5-fe/design/components/navigation"
import * as TextField from "@ject-5-fe/design/components/textField"
import { Magnifier } from "@ject-5-fe/design/icons"
import dynamic from "next/dynamic"
import { parseAsString, useQueryState } from "nuqs"
import { type ChangeEvent, useState } from "react"
import { useDebounce } from "react-simplikit"

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
  ) //실제 url에 반영될 상태 - debounce
  const [localQuery, setLocalQuery] = useState(query) //유저의 입력에 적용될 상태

  const debouncedUpdateQuery = useDebounce((value: string) => {
    setQuery(value)
  }, 300)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setLocalQuery(value)
    debouncedUpdateQuery(value)
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
              value={localQuery}
              onChange={handleChange}
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
