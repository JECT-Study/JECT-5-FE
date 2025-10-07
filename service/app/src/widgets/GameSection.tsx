"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import * as GameCard from "@shared/design/src/components/gameCard"
import { useSuspenseQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { overlay } from "overlay-kit"
import { ErrorBoundary } from "react-error-boundary"

import { GameListItem } from "@/entities/game"
import { getDefaultGame } from "@/entities/game/api/getDefaultGame"
import { getGameDetail } from "@/entities/game/api/getGameDetail"
import { GamePreview } from "@/entities/game/ui/components/gamePreview"
import SSRSafeSuspense from "@/shared/SSRSafeSuspense"

interface GameSectionProps {
  className?: string
}

interface GameSectionHeaderProps {
  onViewMoreGames: () => void
}

const GameSectionHeader = ({ onViewMoreGames }: GameSectionHeaderProps) => {
  return (
    <div className="flex w-full items-center justify-between">
      <h2 className="typography-heading-lg-semibold text-text-interactive-secondary">
        어떤 게임으로 시작해 볼까요?
      </h2>
      <PrimaryBoxButton size="md" _style="outline" onClick={onViewMoreGames}>
        게임 더 보기
      </PrimaryBoxButton>
    </div>
  )
}

const GameCardSectionSkeleton = () => {
  return (
    <div className="flex items-center justify-between">
      {Array.from({ length: 4 }).map((_, index) => (
        <GameCard.Skeleton key={index} />
      ))}
    </div>
  )
}

const GameSectionCardsError = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <p className="text-red-500">게임을 불러오는 중 오류가 발생했습니다.</p>
    </div>
  )
}

interface GameSectionCardsProps {
  onGameCardClick: (game: GameListItem) => void
  onGameCardKeyDown: (event: React.KeyboardEvent, game: GameListItem) => void
}

const GameSectionCards = ({
  onGameCardClick,
  onGameCardKeyDown,
}: GameSectionCardsProps) => {
  const { data: games = [] } = useSuspenseQuery({
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

  return (
    <div className="flex items-center justify-between">
      {games.map((game, _index) => (
        <div key={game.gameId}>
          <button
            onClick={() => onGameCardClick(game)}
            onKeyDown={(e) => onGameCardKeyDown(e, game)}
            aria-label={`${game.gameTitle} 게임 미리보기 보기. ${game.questionCount}개의 질문이 있습니다.`}
            tabIndex={0}
          >
            <GameCard.GameCard>
              <GameCard.Image>
                <Image
                  src={game.gameThumbnailUrl ?? "/checker.svg"}
                  alt={game.gameTitle}
                  fill
                  className="rounded-[10px] object-cover"
                  sizes="178px"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzI3IiBoZWlnaHQ9IjQ1OSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
                />
                <GameCard.Badge>{game.questionCount}문제</GameCard.Badge>
                {game.isShared && (
                  <GameCard.SharedBadge>공유</GameCard.SharedBadge>
                )}
              </GameCard.Image>
              <GameCard.Title>{game.gameTitle}</GameCard.Title>
            </GameCard.GameCard>
          </button>
        </div>
      ))}
    </div>
  )
}

export const GameSection = ({ className = "" }: GameSectionProps) => {
  const router = useRouter()

  const handleViewMoreGames = () => {
    router.push("/library")
  }

  const handleGameCardClick = async (game: GameListItem) => {
    const gameDetailRes = await getGameDetail(game.gameId)

    overlay.open(({ close, isOpen }) => {
      if (gameDetailRes.result === "SUCCESS" && gameDetailRes.data) {
        const gameDetail = gameDetailRes.data

        const handleStartGame = () => {
          close()
          router.push(`/game/${game.gameId}`)
        }

        return (
          <GamePreview
            gameTitle={gameDetail.gameTitle}
            creatorName={gameDetail.nickname}
            questionCount={gameDetail.questionCount}
            questions={gameDetail.questions.map((question) => ({
              id: question.questionId.toString(),
              title: question.questionText,
              imageUrl: question.imageUrl,
            }))}
            onClose={close}
            onStartGame={handleStartGame}
            isOpen={isOpen}
          />
        )
      } else {
        return (
          // TODO: 에러 처리
          <GamePreview onClose={close} isOpen={isOpen} />
        )
      }
    })
  }

  const handleGameCardKeyDown = (
    event: React.KeyboardEvent,
    game: GameListItem,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleGameCardClick(game)
    }
  }

  return (
    <section
      className={`flex w-full flex-col items-center justify-center self-stretch p-0 ${className}`}
      aria-label="게임 섹션"
    >
      <div className="flex min-w-[952px] flex-col gap-7">
        <GameSectionHeader onViewMoreGames={handleViewMoreGames} />
        <ErrorBoundary FallbackComponent={GameSectionCardsError}>
          <SSRSafeSuspense fallback={<GameCardSectionSkeleton />}>
            <GameSectionCards
              onGameCardClick={handleGameCardClick}
              onGameCardKeyDown={handleGameCardKeyDown}
            />
          </SSRSafeSuspense>
        </ErrorBoundary>
      </div>
    </section>
  )
}
