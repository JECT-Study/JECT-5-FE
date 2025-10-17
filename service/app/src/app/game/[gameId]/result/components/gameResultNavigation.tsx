import {
  PrimaryBoxButton,
  SecondaryPlainIconButton,
} from "@ject-5-fe/design/components/button"
import { Cross } from "@ject-5-fe/design/icons"
import Image from "next/image"

import { ThemeToggle } from "@/shared/themeToggleButton"

interface GameResultNavigationProps {
  onGoHome: () => void
  onPreviousQuestion: () => void
}

export const GameResultNavigation = ({
  onGoHome,
  onPreviousQuestion,
}: GameResultNavigationProps) => {
  return (
    <div className="mx-auto flex h-[110px] w-full shrink-0 items-center justify-between">
      <div className="flex w-[420px] items-center gap-[10px] self-stretch px-[40px]">
        <button
          onClick={onGoHome}
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

      <h1 className="typography-heading-lg-semibold whitespace-nowrap text-center text-text-primary">
        게임 종료
      </h1>

      <div className="flex w-[420px] flex-col items-end justify-center gap-2.5">
        <div className="flex items-center justify-end gap-4 px-10">
          <ThemeToggle />

          <PrimaryBoxButton
            size="sm"
            _style="solid"
            onClick={onPreviousQuestion}
          >
            이전 문제
          </PrimaryBoxButton>

          <SecondaryPlainIconButton
            size="lg"
            onClick={onGoHome}
            aria-label="게임 종료"
          >
            <Cross />
          </SecondaryPlainIconButton>
        </div>
      </div>
    </div>
  )
}
