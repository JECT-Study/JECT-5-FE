"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { overlay } from "overlay-kit"

import { GameListItem } from "@/entities/game"
import { getDefaultGame } from "@/entities/game/api/getDefaultGame"
import { getGameDetail } from "@/entities/game/api/getGameDetail"
import { useGameEntryNavigation } from "@/entities/game/hooks/useGameEntryNavigation"
import * as GameCard from "@/entities/game/ui/GameCard/gameCard"
import { GamePreview } from "@/entities/game/ui/gamePreview"
import SSRSafeSuspense from "@/shared/SSRSafeSuspense"
interface GameSectionProps {
  className?: string
}
import { GameCardSkeleton } from "@/entities/game/ui/GameCard/GameCardSkeleton"

import { GameSectionHeader } from "./GameSection/GameSectionHeader"

const GameCardSectionSkeleton = () => {
  return (
    <div className="flex items-center justify-between">
      {Array.from({ length: 4 }).map((_, index) => (
        <GameCardSkeleton key={index} />
      ))}
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
  const { data: games } = useSuspenseQuery({
    queryKey: ["defaultGames"],
    queryFn: async () => await getDefaultGame({ cache: "force-cache" }),
    select: (data) => data.data.games,
    staleTime: Infinity,
  })

  return (
    <div
      className="flex items-center justify-between"
      data-testid="game-section-cards"
    >
      {games?.map((game) => (
        <GameCard.Root
          key={game.gameId}
          className="w-[178px]"
          title={game.gameTitle}
          onClick={() => onGameCardClick(game)}
          onKeyDown={(e) => onGameCardKeyDown(e, game)}
          aria-label="게임 카드"
          tabIndex={0}
        >
          <GameCard.Image
            src={game.gameThumbnailUrl ?? "/checker.svg"}
            alt={game.gameTitle}
            sizes="178px"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzI3IiBoZWlnaHQ9IjQ1OSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
          >
            <GameCard.Badge>{game.questionCount}문제</GameCard.Badge>
            {game.isShared && (
              <GameCard.Badge variant="bottom-left">공유</GameCard.Badge>
            )}
          </GameCard.Image>
          <GameCard.Description>{game.gameTitle}</GameCard.Description>
        </GameCard.Root>
      ))}
    </div>
  )
}

export const GameSection = ({ className = "" }: GameSectionProps) => {
  const { startGame } = useGameEntryNavigation()

  const handleGameCardClick = async (game: GameListItem) => {
    const { data: gameDetail } = await getGameDetail(game.gameId)

    overlay.open(({ close, isOpen }) => {
      const handleStartGame = () => {
        close()
        startGame(game.gameId)
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
      <div className="flex min-w-[952px] flex-col gap-28">
        <GameSectionHeader />
        <SSRSafeSuspense fallback={<GameCardSectionSkeleton />}>
          <GameSectionCards
            onGameCardClick={handleGameCardClick}
            onGameCardKeyDown={handleGameCardKeyDown}
          />
        </SSRSafeSuspense>
      </div>
    </section>
  )
}
