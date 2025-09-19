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
        className={cn("relative", className)}
      >
        <div className="flex flex-col gap-12">{children}</div>
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
      <h3
        className={cn(
          "line-clamp-2 h-[46px] w-[178px] overflow-hidden text-ellipsis text-[19px] font-bold leading-[120%] text-text-primary",
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
        "absolute left-8 top-8 inline-flex items-center justify-center gap-[10px] rounded-[4px] bg-background-badge-primary px-[5px] py-[2px]",
        className,
      )}
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
      role="status"
      aria-label="공유 배지"
      className={cn(
        "absolute bottom-8 left-8 inline-flex items-center justify-center gap-[10px] rounded-[2px] bg-background-badge-secondary px-[5px] py-[2px]",
        className,
      )}
    >
      <span className="text-[13px] font-normal leading-[120%] text-text-inverse">
        {children}
      </span>
    </div>
  )
}

interface GameCardSkeletonProps {
  className?: string
}

const GameCardSkeleton = ({ className }: GameCardSkeletonProps) => {
  return (
    <div
      className={cn("flex w-[178px] flex-col items-start gap-12", className)}
    >
      <div className="size-[178px] animate-pulse rounded-[10px] bg-gray-200" />
      <div className="h-[46px] w-[178px] animate-pulse rounded bg-gray-200" />
    </div>
  )
}

export const GameCard = Object.assign(GameCardComponent, {
  Image: GameCardImage,
  Title: GameCardTitle,
  Badge: GameCardBadge,
  SharedBadge: GameCardSharedBadge,
  Skeleton: GameCardSkeleton,
})

GameCardComponent.displayName = "GameCard"
