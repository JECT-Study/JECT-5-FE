import { Add, Minus } from "../../icons"
import { cn } from "../../utils/cn"
import { SecondaryPlainIconButton } from "../button"

interface PlayerStatusProps {
  name: string
  score: string
  scoreView?: boolean
  onScoreIncrease?: () => void
  onScoreDecrease?: () => void
  className?: string
}

export const PlayerStatus = ({
  name,
  score,
  scoreView = true,
  onScoreIncrease,
  onScoreDecrease,
  className,
}: PlayerStatusProps) => {
  if (!scoreView) {
    return (
      <div
        className={cn(
          "flex w-full items-center justify-center rounded-12 bg-background-primary py-40",
          className,
        )}
        role="group"
        aria-label={`${name} 카드`}
      >
        <span className="block w-[145px] truncate text-center font-pretendard text-[33px] font-normal leading-[120%] text-text-primary">
          {name}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative flex w-full items-center overflow-hidden rounded-12 bg-background-primary py-40",
        className,
      )}
      role="group"
      aria-label={`${name} 점수 카드`}
    >
      <SecondaryPlainIconButton
        size="lg"
        className="group absolute inset-y-0 left-0 z-10 flex h-auto w-1/2 cursor-pointer items-center justify-center gap-16 rounded-l-12 rounded-r-none transition-colors hover:bg-[#FFC7C8] active:bg-[#FF6467]"
        onClick={onScoreDecrease}
        aria-label={`${name} 점수 감소`}
      >
        <Minus className="size-32 shrink-0" />
        <span className="block w-[100px] truncate text-center font-pretendard text-[33px] font-light leading-[120%] text-text-primary">
          {name}
        </span>
      </SecondaryPlainIconButton>

      <SecondaryPlainIconButton
        size="lg"
        className="group absolute inset-y-0 right-0 z-10 flex h-auto w-1/2 cursor-pointer items-center justify-between rounded-l-none rounded-r-12 px-20 transition-colors hover:bg-[#BDDCFF] active:bg-[#51A2FF]"
        onClick={onScoreIncrease}
        aria-label={`${name} 점수 증가`}
      >
        <span className="typography-heading-lg-semibold text-text-primary">
          {score}
        </span>
        <Add className="size-32 shrink-0" />
      </SecondaryPlainIconButton>
    </div>
  )
}
