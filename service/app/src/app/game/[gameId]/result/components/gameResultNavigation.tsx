import {
  PrimaryBoxButton,
  SecondaryPlainIconButton,
} from "@ject-5-fe/design/components/button"
import { Navigation } from "@ject-5-fe/design/components/navigation"
import { Cross } from "@ject-5-fe/design/icons"
import Image from "next/image"

import { ThemeToggle } from "@/shared/themeToggleButton"

interface GameResultNavigationProps {
  onExit: () => void
  onPreviousQuestion: () => void
}

export const GameResultNavigation = ({
  onExit,
  onPreviousQuestion,
}: GameResultNavigationProps) => {
  return (
    <Navigation
      leftContent={
        <button onClick={onExit}>
          <Image src="/logo.svg" alt="홈 로고" width={268} height={60} />
        </button>
      }
      centerContent={
        <h1 className="typography-heading-lg-semibold whitespace-nowrap text-text-primary">
          게임 종료
        </h1>
      }
      rightContent={
        <>
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
            onClick={onExit}
            aria-label="게임 종료"
          >
            <Cross />
          </SecondaryPlainIconButton>
        </>
      }
    />
  )
}
