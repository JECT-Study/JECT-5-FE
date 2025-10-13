"use client"
import {
  PrimaryBoxButton,
  SecondaryPlainIconButton,
} from "@ject-5-fe/design/components/button"
import { ThemeToggle } from "@ject-5-fe/design/components/themeToggle"
import { Cross } from "@ject-5-fe/design/icons"
import { Navigation } from "@shared/design/src/components/navigation"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { openExitConfirmDialog } from "../../components/dialogs/exitConfirmDialog"
import { useGameStore } from "../../store/useGameStore"
import { canStartGame } from "../../utils/teamValidation"

export function GameNavigation() {
  const setGameStatus = useGameStore((state) => state.setGameStatus)
  const teams = useGameStore((state) => state.teams)

  const isGameReady = canStartGame(teams)

  const router = useRouter()

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
          <PrimaryBoxButton
            size="sm"
            _style="solid"
            disabled={!isGameReady}
            onClick={() => {
              if (isGameReady) {
                setGameStatus("playing")
                router.push("./play")
              }
            }}
          >
            게임 시작
          </PrimaryBoxButton>
          <SecondaryPlainIconButton
            size="lg"
            onClick={() => {
              openExitConfirmDialog({
                onConfirm: () => router.push("/"),
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
