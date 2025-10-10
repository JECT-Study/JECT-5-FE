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
        "flex max-h-[118px] w-[350px] items-center justify-center rounded-[10px] bg-background-primary p-[39px_20px]",
        className,
      )}
      role="group"
      aria-label={`${name} 점수 카드`}
    >
      <div className="flex h-10 min-h-10 max-w-[310px] flex-1 items-center justify-center gap-20">
        <h3
          className={`typography-heading-xl-medium flex h-10 min-w-0 items-center text-center ${scoreView ? "flex-1" : "w-full"}`}
        >
          <span className="block w-full truncate">{name}</span>
        </h3>

        {scoreView && (
          <div className="flex h-10 w-[138px] items-center justify-between gap-1.5">
            <SecondaryPlainIconButton
              size="lg"
              onClick={onScoreDecrease}
              aria-label={`${name} 점수 감소`}
            >
              <Minus />
            </SecondaryPlainIconButton>

            <div className="flex h-10 items-center justify-center">
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
