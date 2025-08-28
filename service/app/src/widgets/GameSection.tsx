"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import { GameCard } from "@shared/design/src/components/gameCard"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { overlay } from "overlay-kit"

import { GameListItem } from "@/entities/game"
import { getDefaultGame } from "@/entities/game/api/getDefaultGame"
import { getGameDetail } from "@/entities/game/api/getGameDetail"
import { GamePreview } from "@/entities/game/ui/components/gamePreview"
import { useMsw } from "@/mocks/mswProvider"

interface GameSectionProps {
  className?: string
}

export const GameSection = ({ className = "" }: GameSectionProps) => {
  const router = useRouter()
  const { isMswReady } = useMsw()

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
    enabled: isMswReady,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

  const handleViewMoreGames = () => {
    router.push("/games")
  }

  const handleGameCardClick = async (game: GameListItem) => {
    try {
      const gameDetailRes = await getGameDetail(game.gameId)

      if (gameDetailRes.result === "SUCCESS" && gameDetailRes.data) {
        const gameDetail = gameDetailRes.data

        overlay.open(({ close, isOpen }) => {
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
        })
      } else {
        console.error("Failed to fetch game detail")
      }
    } catch (error) {
      console.error("Error fetching game detail:", error)
    }
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

  if (error) {
    return (
      <section
        className={`flex w-full flex-col items-center gap-[45px] ${className}`}
        aria-label="게임 섹션"
      >
        <div className="flex w-[952px] items-center justify-between">
          <h2 className="typography-heading-lg-semibold text-text-interactive-secondary">
            어떤 게임으로 시작해 볼까요?
          </h2>
          <PrimaryBoxButton
            size="md"
            _style="solid"
            onClick={handleViewMoreGames}
            aria-label="더 많은 게임 보기"
          >
            게임 더 보기
          </PrimaryBoxButton>
        </div>
        <div
          className="flex w-full items-center justify-center"
          role="alert"
          aria-live="assertive"
        >
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
      aria-label="게임 섹션"
    >
      <div className="flex w-[952px] items-center justify-between">
        <h2 className="typography-heading-lg-semibold text-text-interactive-secondary">
          어떤 게임으로 시작해 볼까요?
        </h2>
        <PrimaryBoxButton
          size="md"
          _style="solid"
          onClick={handleViewMoreGames}
          aria-label="더 많은 게임 보기"
        >
          게임 더 보기
        </PrimaryBoxButton>
      </div>

      <div
        className="flex items-center gap-[80px]"
        role="region"
        aria-label="추천 게임 목록"
      >
        {isLoading ? (
          <div
            aria-live="polite"
            aria-label="게임 목록 로딩 중"
            className="flex items-center gap-[80px]"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex w-[178px] flex-col items-start gap-[14px]"
                aria-hidden="true"
              >
                <div className="size-[178px] animate-pulse rounded-[10px] bg-gray-200" />
                <div className="h-[46px] w-[178px] animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <div
            role="list"
            aria-label={`${games.length}개의 추천 게임`}
            className="flex items-center gap-[80px]"
          >
            {games.map((game, _index) => (
              <div
                key={game.gameId}
                role="listitem"
                className="flex w-[178px] flex-col items-start gap-[14px]"
              >
                <button
                  onClick={() => handleGameCardClick(game)}
                  onKeyDown={(e) => handleGameCardKeyDown(e, game)}
                  className="cursor-pointer border-none bg-transparent p-0 focus:outline-none"
                  aria-label={`${game.gameTitle} 게임 미리보기 보기. ${game.questionCount}개의 질문이 있습니다.`}
                  tabIndex={0}
                >
                  <GameCard>
                    <GameCard.Image>
                      {game.gameThumbnailUrl ? (
                        <Image
                          src={game.gameThumbnailUrl}
                          alt={game.gameTitle}
                          fill
                          className="rounded-[10px] object-cover"
                          sizes="178px"
                          priority={_index < 2}
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzI3IiBoZWlnaHQ9IjQ1OSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center rounded-[10px] bg-gray-200">
                          <span className="text-[14px] font-medium text-gray-500">
                            이미지 없음
                          </span>
                        </div>
                      )}
                      <GameCard.Badge>{game.questionCount}문제</GameCard.Badge>
                      {game.isShared && (
                        <GameCard.SharedBadge>공유</GameCard.SharedBadge>
                      )}
                    </GameCard.Image>
                    <GameCard.Title>{game.gameTitle}</GameCard.Title>
                  </GameCard>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
