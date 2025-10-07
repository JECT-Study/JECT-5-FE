"use client"

import { useRouter } from "next/navigation"
import { overlay } from "overlay-kit"

import { GameListItem } from "@/entities/game"
import { getGameDetail } from "@/entities/game/api"
import { GameDashboardGrid } from "@/entities/game/ui/components"
import { GamePreview } from "@/entities/game/ui/components/gamePreview"
import SSRSafeSuspense from "@/shared/SSRSafeSuspense"
import DashboardNavigation from "@/widgets/DashboardNavigation"

import GameCardGridSkeleton from "./loading"

export default function DashboardPage() {
  const router = useRouter()

  const handleGameClick = async (game: GameListItem) => {
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

  return (
    <main className="flex min-h-screen flex-col gap-[11vh] bg-background-primary">
      <DashboardNavigation />
      <div className="flex flex-col items-center">
        <SSRSafeSuspense fallback={<GameCardGridSkeleton />}>
          <GameDashboardGrid onGameClick={handleGameClick} limit={19} />
        </SSRSafeSuspense>
      </div>
    </main>
  )
}
