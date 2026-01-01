import type { ReactNode } from "react"
import { forwardRef } from "react"

import { cn } from "../../utils/cn"

interface GameCardProps {
  children: ReactNode
  className?: string
  title?: string
}

const GameCardComponent = forwardRef<HTMLDivElement, GameCardProps>(
  ({ children, className, title }, ref) => {
    const accessibleName = title ? `${title} 게임 카드` : "게임 카드"
    return (
      <div
        ref={ref}
        role="group"
        aria-label={accessibleName}
        className={cn("relative flex flex-col gap-12", className)}
      >
        {children}
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
        "relative size-[178px] rounded-12 bg-cover bg-center bg-no-repeat",
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
    <div className="flex h-[46px] w-[178px]">
      <h3
        className={cn(
          "typography-body-lg-extrabold line-clamp-2 h-[46px] w-[178px] overflow-hidden text-ellipsis break-keep text-text-primary",
          className,
        )}
      >
        {children}
      </h3>
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
      aria-label="문제 수 배지"
      className={cn(
        "absolute left-8 top-8 inline-flex items-center justify-center rounded-4 bg-background-badge-primary px-4 py-2",
        className,
      )}
    >
      <span className="typography-body-md-medium text-text-inverse">
        {children}
      </span>
    </div>
  )
}

const GameCardSharedBadge = ({ children, className }: GameCardBadgeProps) => {
  return (
    <div
      role="status"
      aria-label="공유 배지"
      className={cn(
        "absolute bottom-8 left-8 inline-flex items-center justify-center rounded-2 bg-background-badge-secondary px-4 py-2",
        className,
      )}
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
