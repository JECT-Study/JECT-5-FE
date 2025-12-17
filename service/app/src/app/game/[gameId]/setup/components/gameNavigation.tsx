"use client"
import { SecondaryPlainIconButton } from "@ject-5-fe/design/components/button"
import { Navigation } from "@ject-5-fe/design/components/navigation"
import { Cross } from "@ject-5-fe/design/icons"
import Image from "next/image"

import { useGameEntryNavigation } from "@/entities/game/hooks/useGameEntryNavigation"
import { ThemeToggle } from "@/shared/themeToggleButton"

export function GameNavigation() {
  const { goBackToEntry } = useGameEntryNavigation()

  return (
    <Navigation
      leftContent={
        <SecondaryPlainIconButton asChild onClick={goBackToEntry}>
          <Image
            src="/logo.svg"
            alt="홈 로고"
            className="size-full"
            width={268}
            height={60}
          />
        </SecondaryPlainIconButton>
      }
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
