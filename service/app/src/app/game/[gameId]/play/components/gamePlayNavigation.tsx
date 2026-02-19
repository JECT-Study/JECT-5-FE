import { SecondaryPlainIconButton } from "@ject-5-fe/design/components/button"
import { Progress } from "@ject-5-fe/design/components/progress"
import { Cross } from "@ject-5-fe/design/icons"

import { ThemeToggle } from "@/shared/themeToggleButton"
import { HomeButton } from "@/widgets/components/homeButton"

interface GamePlayHeaderProps {
  currentRound: number
  totalRounds: number
  onExit: () => void
}

export const GamePlayHeader = ({
  currentRound,
  totalRounds,
  onExit,
}: GamePlayHeaderProps) => {
  return (
    <header className="absolute inset-x-0 top-0 mx-auto flex h-[90px] w-full shrink-0 items-center justify-between">
      <div className="flex w-[420px] items-center gap-[10px] self-stretch px-[40px]">
        <HomeButton onClick={onExit} />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <Progress
          className="h-[25px] w-full"
          value={totalRounds > 0 ? (currentRound / totalRounds) * 100 : 0}
          max={100}
        />
      </div>

      <div className="flex w-[420px] flex-col items-end justify-center">
        <div className="flex items-center justify-end gap-16 px-10">
          <ThemeToggle />

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
