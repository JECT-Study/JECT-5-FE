"use client"
import {
  PrimaryBoxButton,
  SecondaryPlainIconButton,
} from "@ject-5-fe/design/components/button"
import { ThemeToggle } from "@ject-5-fe/design/components/themeToggle"
import { Cross } from "@ject-5-fe/design/icons"
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
    <div className="mx-auto flex h-[110px] w-full shrink-0 items-center justify-between">
      <div className="flex w-[420px] items-center gap-[10px] self-stretch px-[40px]">
        <Link
          href="/"
          className="flex h-[60px] w-[268px] flex-col items-center justify-center gap-2.5 p-3.5"
        >
          <Image
            src="/logo.svg"
            alt="홈 로고"
            className="size-full"
            width={268}
            height={60}
          />
        </Link>
      </div>

      <h1 className="typography-heading-lg-semibold whitespace-nowrap text-center text-text-primary">
        참가자 설정
      </h1>

      <div className="flex w-[420px] flex-col items-end justify-center gap-2.5">
        <div className="flex items-center justify-end gap-4 px-10">
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
        </div>
      </div>
    </div>
  )
}
