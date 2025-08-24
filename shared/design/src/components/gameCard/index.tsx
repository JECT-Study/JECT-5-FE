import type { ReactNode } from "react"
import { forwardRef } from "react"

import { cn } from "../../utils/cn"

interface GameCardProps {
  children: ReactNode
  className?: string
}

const GameCardComponent = forwardRef<HTMLDivElement, GameCardProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        data-testid="game-card"
      >
        <div className="flex flex-col gap-[14px]">{children}</div>
      </div>
    )
  },
)

interface GameCardImageProps {
  children: ReactNode
  className?: string
}

const GameCardImage = ({ children, className }: GameCardImageProps) => {
  return (
    <div
      className={cn(
        "relative size-[178px] rounded-[10px] bg-cover bg-center bg-no-repeat",
        className,
      )}
    >
      {children}
    </div>
  )
}

interface GameCardTitleProps {
  children: ReactNode
  className?: string
}

const GameCardTitle = ({ children, className }: GameCardTitleProps) => {
  return (
    <div className="h-[46px] w-[178px]">
      <div
        className={cn(
          "line-clamp-2 h-[46px] w-[178px] overflow-hidden text-ellipsis text-[19px] font-bold leading-[120%] text-text-primary",
          className,
        )}
        data-testid="game-title"
      >
        {children}
      </div>
    </div>
  )
}

interface GameCardBadgeProps {
  children: ReactNode
  className?: string
}

const GameCardBadge = ({ children, className }: GameCardBadgeProps) => {
  return (
    <div
      className={cn(
        "absolute left-2 top-2 inline-flex items-center justify-center gap-[10px] rounded-[2px] bg-background-badge-primary px-[5px] py-[2px]",
        className,
      )}
      data-testid="question-count"
    >
      <span className="text-[13px] font-normal leading-[120%] text-text-inverse">
        {children}
      </span>
    </div>
  )
}

const GameCardSharedBadge = ({ children, className }: GameCardBadgeProps) => {
  return (
    <div
      className={cn(
        "absolute bottom-2 left-2 inline-flex items-center justify-center gap-[10px] rounded-[2px] bg-background-badge-secondary px-[5px] py-[2px]",
        className,
      )}
      data-testid="shared-badge"
    >
      <span className="text-[13px] font-normal leading-[120%] text-text-inverse">
        {children}
      </span>
    </div>
  )
}

export const GameCard = Object.assign(GameCardComponent, {
  Image: GameCardImage,
  Title: GameCardTitle,
  Badge: GameCardBadge,
  SharedBadge: GameCardSharedBadge,
})

GameCardComponent.displayName = "GameCard"
