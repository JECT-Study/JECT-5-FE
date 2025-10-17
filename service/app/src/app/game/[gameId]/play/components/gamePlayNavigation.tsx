import {
  PrimaryBoxButton,
  SecondaryPlainIconButton,
} from "@ject-5-fe/design/components/button"
import { Progress } from "@ject-5-fe/design/components/progress"
import { Cross } from "@ject-5-fe/design/icons"
import Image from "next/image"

import { ThemeToggle } from "@/shared/themeToggleButton"

interface GamePlayHeaderProps {
  currentRound: number
  totalRounds: number
  onPrevQuestion: () => void
  onNextQuestion: () => void
  onExit: () => void
}

export const GamePlayHeader = ({
  currentRound,
  totalRounds,
  onPrevQuestion,
  onNextQuestion,
  onExit,
}: GamePlayHeaderProps) => {
  return (
    <header className="mx-auto flex h-[110px] w-full shrink-0 items-center justify-between">
      <div className="flex w-[420px] items-center gap-[10px] self-stretch px-[40px]">
        <button
          onClick={onExit}
          className="flex h-[60px] w-[268px] flex-col items-center justify-center gap-2.5 p-3.5"
        >
          <Image
            src="/logo.svg"
            alt="홈 로고"
            className="size-full"
            width={268}
            height={60}
          />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <Progress
          className="h-[25px] w-[1080px]"
          value={totalRounds > 0 ? (currentRound / totalRounds) * 100 : 0}
          max={100}
        />
      </div>

      <div className="flex w-[420px] flex-col items-end justify-center gap-2.5">
        <div className="flex items-center justify-end gap-4 px-10">
          <ThemeToggle />

          {currentRound > 1 && (
            <PrimaryBoxButton size="sm" _style="solid" onClick={onPrevQuestion}>
              이전 문제
            </PrimaryBoxButton>
          )}

          <PrimaryBoxButton size="sm" _style="solid" onClick={onNextQuestion}>
            다음 문제
          </PrimaryBoxButton>

          <SecondaryPlainIconButton
            size="lg"
            onClick={onExit}
            aria-label="게임 종료"
          >
            <Cross />
          </SecondaryPlainIconButton>
        </div>
      </div>
    </header>
  )
}
