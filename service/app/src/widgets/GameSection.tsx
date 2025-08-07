"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import { GameCard } from "@shared/design/src/components/gameCard"
import { useRouter } from "next/navigation"

import { GameListItem } from "@/entities/game"

interface GameSectionProps {
  className?: string
}

export const GameSection = ({ className = "" }: GameSectionProps) => {
  const router = useRouter()

  const handleViewMoreGames = () => {
  }

  return (
    <section className={`flex w-full flex-col items-center gap-[45px] ${className}`}>
      <div className="flex w-[952px] items-center justify-between">
        <h2 className="typography-heading-lg-semibold text-neutral-black">
          어떤 게임으로 시작해 볼까요?
        </h2>
        <PrimaryBoxButton
          size="md"
          _style="solid"
          onClick={handleViewMoreGames}
        >
          게임 더 보기
        </PrimaryBoxButton>
      </div>

      <div className="flex items-center gap-[80px]">
        {/* {games.map((game) => (
          <GameCard
            key={game.id}
            type="libraryGame"
            title={game.title}
            questionCount={game.questionCount}
            imageUrl={game.thumbnail}
          />
        ))} */}
      </div>
    </section>
  )
} 