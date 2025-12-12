"use client"
import { SecondaryPlainIconButton } from "@ject-5-fe/design/components/button"
import { Navigation } from "@ject-5-fe/design/components/navigation"
import { Cross } from "@ject-5-fe/design/icons"
import Image from "next/image"
import Link from "next/link"

import { useGameEntryNavigation } from "@/entities/game/hooks/useGameEntryNavigation"
import { ThemeToggle } from "@/shared/themeToggleButton"

import { openExitConfirmDialog } from "../../components/dialogs/exitConfirmDialog"

export function GameNavigation() {
  const { goBackToEntry } = useGameEntryNavigation()

  return (
    <Navigation
      leftContent={
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="홈 로고"
            className="size-full"
            width={268}
            height={60}
          />
        </Link>
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
            onClick={() => {
              openExitConfirmDialog({
                onConfirm: () => {
                  goBackToEntry()
                },
              })
            }}
          >
            <Cross />
          </SecondaryPlainIconButton>
        </>
      }
    />
  )
}
