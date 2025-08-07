"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import { GameCard } from "@shared/design/src/components/gameCard"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { GameListItem } from "@/entities/game"
import { getDefaultGame } from "@/entities/game/api/getDefaultGame"

interface GameSectionProps {
  className?: string
}

export const GameSection = ({ className = "" }: GameSectionProps) => {
  const router = useRouter()

  const {
    data: games = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["defaultGames"],
    queryFn: async (): Promise<GameListItem[]> => {
      const res = await getDefaultGame()
      if (res.result === "SUCCESS" && res.data) {
        return res.data.games
      }
      throw new Error("Failed to fetch default games")
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

  const handleViewMoreGames = () => {
    router.push("/games")
  }

  if (error) {
    return (
      <section
        className={`flex w-full flex-col items-center gap-[45px] ${className}`}
      >
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
        <div className="flex w-full items-center justify-center">
          <p className="text-red-500">
            게임을 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      className={`flex w-full flex-col items-center gap-[45px] ${className}`}
    >
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
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex w-[178px] flex-col items-start gap-[14px]"
              >
                <div className="size-[178px] animate-pulse rounded-[10px] bg-gray-200" />
                <div className="h-[46px] w-[178px] animate-pulse rounded bg-gray-200" />
              </div>
            ))
          : games.map((game) => (
              <GameCard
                key={game.gameId}
                type="libraryGame"
                title={game.gameTitle}
                questionCount={game.questionCount}
                imageUrl={game.gameThumbnailUrl}
              />
            ))}
      </div>
    </section>
  )
}
