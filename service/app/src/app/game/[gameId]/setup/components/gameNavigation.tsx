"use client"

import { SecondaryPlainIconButton } from "@ject-5-fe/design/components/button"
import { Navigation } from "@ject-5-fe/design/components/navigation"
import { Cross } from "@ject-5-fe/design/icons"

import { useGameEntryNavigation } from "@/entities/game/hooks/useGameEntryNavigation"
import { ThemeToggle } from "@/shared/themeToggleButton"
import { HomeButton } from "@/widgets/components/homeButton"

export function GameNavigation() {
  const { goBackToEntry } = useGameEntryNavigation()

  return (
    <Navigation
      leftContent={<HomeButton onClick={goBackToEntry} />}
      centerContent={
        <h1 className="typography-heading-lg-semibold whitespace-nowrap text-text-primary">
          참가자 설정
        </h1>
      }
      rightContent={
        <>
          <ThemeToggle />
          <SecondaryPlainIconButton
            size="lg"
            aria-label="나가기"
            onClick={() => {
              goBackToEntry()
            }}
          >
            <Cross />
          </SecondaryPlainIconButton>
        </>
      }
    />
  )
}
