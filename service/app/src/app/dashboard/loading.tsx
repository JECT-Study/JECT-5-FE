import { GameCard } from "@shared/design/src/components/gameCard"
import { GameCreate } from "@shared/design/src/components/gameCreate"

export default function GameCardGridSkeleton() {
  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-5 gap-60">
        <GameCreate />
        {Array.from({ length: 19 }).map((_, index) => (
          <GameCard.Skeleton key={index} />
        ))}
      </div>
    </div>
  )
}
