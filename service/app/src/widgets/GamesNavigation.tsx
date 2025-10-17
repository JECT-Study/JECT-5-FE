"use client"

import { Navigation } from "@ject-5-fe/design/components/navigation"
import * as TextField from "@ject-5-fe/design/components/textField"
import { ThemeToggle } from "@ject-5-fe/design/components/themeToggle"
import { Magnifier } from "@ject-5-fe/design/icons"
import dynamic from "next/dynamic"

import { HomeButton } from "./components/homeButton"

const GamesAuthButton = dynamic(() => import("@/shared/authButton"), {
  ssr: false,
})

interface GamesNavigationProps {
  className?: string
  searchQuery?: string
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const GamesNavigation = ({
  className,
  searchQuery = "",
  onSearchChange,
}: GamesNavigationProps) => {
  return (
    <Navigation
      className={className}
      leftContent={<HomeButton />}
      centerContent={
        <div className="hidden w-full max-w-[871px] md:flex">
          <TextField.Root name="game" className="w-full">
            <TextField.InputWrapper>
              <Magnifier className="size-32 text-icon-interactive-input-default" />
              <TextField.Input
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="오늘의 추천 게임은?"
              />
            </TextField.InputWrapper>
          </TextField.Root>
        </div>
      }
      rightContent={
        <>
          <GamesAuthButton />
          <ThemeToggle />
        </>
      }
    />
  )
}
