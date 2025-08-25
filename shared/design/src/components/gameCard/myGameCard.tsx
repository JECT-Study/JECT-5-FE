import { forwardRef } from "react"

import { GameCard } from "./index"

type MyGameCardProps = {
  children: React.ReactNode
  className?: string
  title?: string
}

export const MyGameCard = forwardRef<HTMLDivElement, MyGameCardProps>(
  (props, ref) => {
    const { children, className, title } = props

    return (
      <GameCard
        ref={ref}
        className={className}
        title={title}
        data-testid="my-game-card"
      >
        {children}
      </GameCard>
    )
  },
)

MyGameCard.displayName = "MyGameCard"
