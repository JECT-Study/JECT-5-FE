import { forwardRef } from "react"

import { GameCard } from "./index"

type MyGameCardProps = {
  children: React.ReactNode
  className?: string
}

export const MyGameCard = forwardRef<HTMLDivElement, MyGameCardProps>(
  (props, ref) => {
    const { children, className } = props

    return (
      <GameCard ref={ref} className={className}>
        {children}
      </GameCard>
    )
  },
)

MyGameCard.displayName = "MyGameCard"
