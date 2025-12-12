"use client"

import { useRouter } from "next/navigation"
import { useShallow } from "zustand/react/shallow"

import { useGameEntryNavigation } from "@/entities/game/hooks/useGameEntryNavigation"
import { useTypedSearchParams } from "@/shared/lib/useTypedSearchParams"

import { openExitConfirmDialog } from "../components/dialogs/exitConfirmDialog"
import { useGameStore } from "../store/useGameStore"
import { GamePlayContent } from "./components/gamePlayContent"
import { GamePlayHeader } from "./components/gamePlayNavigation"
import { ScoreboardSidebar } from "./components/scoreboardSidebar"
import { gamePlaySchema } from "./schemas"

const ScoreboardGame = () => {
  const router = useRouter()
  const [{ q: currentRound }, setSearchParams] =
    useTypedSearchParams(gamePlaySchema)

  const { gameDetail, teams, totalRounds, updateTeamScore, resetGame } =
    useGameStore(
      useShallow((state) => ({
        gameDetail: state.gameDetail,
        teams: state.teams,
        totalRounds: state.totalRounds,
        updateTeamScore: state.updateTeamScore,
        resetGame: state.resetGame,
      })),
    )

  const currentQuestion = gameDetail.questions.find(
    (q) => q.questionOrder === currentRound - 1,
  )

  if (!currentQuestion) {
    throw new Error("질문을 찾을 수 없습니다.")
  }

  const handleNextQuestion = () => {
    if (currentRound === totalRounds) {
      router.push("./result")
      return
    }
    setSearchParams({ q: (currentRound + 1).toString() })
  }

  const { goBackToEntry } = useGameEntryNavigation()

  return (
    <>
      <GamePlayHeader
        currentRound={currentRound}
        totalRounds={totalRounds}
        onExit={() =>
          openExitConfirmDialog({
            onConfirm: () => {
              resetGame()
              goBackToEntry()
            },
          })
        }
      />
      <div className="absolute left-[20px] top-[110px] z-10">
        <ScoreboardSidebar teams={teams} onUpdateTeamScore={updateTeamScore} />
      </div>
      <div>
        <GamePlayContent
          currentQuestion={currentQuestion}
          currentRound={currentRound}
          totalRounds={totalRounds}
          onPrevQuestion={() => {
            if (currentRound <= 1) return
            setSearchParams({ q: (currentRound - 1).toString() })
          }}
          onNextQuestion={handleNextQuestion}
        />
      </div>
    </>
  )
}

export default ScoreboardGame
