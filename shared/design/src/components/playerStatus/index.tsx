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
  return (
    <div
      className={cn(
        "flex min-h-[40px] w-[310px] items-center justify-center rounded-12 bg-background-primary",
        className,
      )}
      role="group"
      aria-label={`${name} 점수 카드`}
    >
      <div className="flex h-10 min-h-10 max-w-[310px] flex-1 items-center justify-center gap-20">
        <h3
          className={`typography-heading-xl-medium flex h-[40px] min-w-0 items-center text-center ${scoreView ? "flex-1" : "w-full"}`}
        >
          <span className="block w-full truncate">{name}</span>
        </h3>

        {scoreView && (
          <div className="flex h-[40px] w-[138px] items-center justify-between gap-8">
            <SecondaryPlainIconButton
              size="lg"
              onClick={onScoreDecrease}
              aria-label={`${name} 점수 감소`}
            >
              <Minus />
            </SecondaryPlainIconButton>

            <div className="flex h-[40px] items-center justify-center">
              <span
                className="typography-heading-lg-semibold"
                aria-label={`${name} 현재 점수`}
              >
                {score}
              </span>
            </div>

            <SecondaryPlainIconButton
              size="lg"
              onClick={onScoreIncrease}
              aria-label={`${name} 점수 증가`}
            >
              <Add />
            </SecondaryPlainIconButton>
          </div>
        )}
      </div>
    </div>
  )
}
