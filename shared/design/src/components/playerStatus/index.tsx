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
        "max-h-[118px] w-[350px] rounded-[10px] bg-background-primary p-[20px_39px]",
        className,
      )}
    >
      <div className="flex h-10 min-h-10 items-center gap-5">
        <h3 className="typography-heading-xl-medium flex h-10 min-w-0 flex-1 items-center">
          <span className="block w-full truncate">{name}</span>
        </h3>

        <div className="flex h-10 w-[138px] items-center justify-between gap-1.5">
          {scoreView && (
            <>
              <SecondaryPlainIconButton size="lg" onClick={onScoreDecrease}>
                <Minus />
              </SecondaryPlainIconButton>

              <div className="flex h-10 items-center justify-center">
                <span className="typography-heading-lg-semibold">{score}</span>
              </div>

              <SecondaryPlainIconButton size="lg" onClick={onScoreIncrease}>
                <Add />
              </SecondaryPlainIconButton>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
