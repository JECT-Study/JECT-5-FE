import { GameCardSkeleton } from "@/entities/game/ui/GameCard/GameCardSkeleton"

export const GameSectionSkeleton = () => {
  return (
    <div className="flex items-center justify-between">
      {Array.from({ length: 4 }).map((_, index) => (
        <GameCardSkeleton key={index} />
      ))}
    </div>
  )
}
