"use client"
import {
  PrimaryBoxButton,
  PrimarySolidIconButton,
  SecondaryGhostIconButton,
  SecondaryOutlineBoxButton,
  SecondaryPlainIconButton,
} from "@ject-5-fe/design/components/button"
import { PlayerStatus } from "@ject-5-fe/design/components/playerStatus"
import { Progress } from "@ject-5-fe/design/components/progress"
import { Cross, Hidden, Show, Sun } from "@ject-5-fe/design/icons"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import { openExitConfirmDialog } from "../components/dialogs/exitConfirmDialog"
import { useGameStoreContext } from "../store/gameProvider"
import { useGameStore } from "../store/useGameStore"

const ScoreboardGame = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showAnswer, setShowAnswer] = useState(false)
  const router = useRouter()
  const params = useParams()
  const gameStoreApi = useGameStoreContext()

  const {
    teams,
    gameDetail,
    currentRound,
    totalRounds,
    setRound,
    updateTeamScore,
  } = useGameStore((state) => state)

  const currentQuestion = gameDetail?.questions.find(
    (q) => q.questionOrder === currentRound - 1,
  )

  const handlePrevQuestion = () => {
    if (currentRound <= 1) return
    const newRound = currentRound - 1
    setRound(newRound)
    router.replace(`?q=${newRound}`)
    setShowAnswer(false)
  }

  const handleNextQuestion = () => {
    if (currentRound === totalRounds) {
      router.push(`/game/${params.gameId}/result`)
      return
    }
    const newRound = Math.min(currentRound + 1, totalRounds)
    setRound(newRound)
    router.replace(`?q=${newRound}`)
    setShowAnswer(false)
  }

  const handleShowAnswer = () => {
    setShowAnswer((prev) => !prev)
  }

  const progressValue = useMemo(() => {
    if (!totalRounds || totalRounds <= 0) return 0
    return Math.min(
      100,
      Math.max(0, Math.round((currentRound / totalRounds) * 100)),
    )
  }, [currentRound, totalRounds])

  const clampScore = (value: number) => Math.max(-100, Math.min(100, value))

  const handleIncreaseScore = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId)
    if (!team) return
    updateTeamScore(teamId, clampScore(team.score + 1))
  }

  const handleDecreaseScore = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId)
    if (!team) return
    updateTeamScore(teamId, clampScore(team.score - 1))
  }

  return (
    <>
      <div className="mx-auto flex h-[110px] w-[1920px] shrink-0 items-center justify-between">
        <div className="flex w-[420px] items-center gap-[10px] self-stretch px-[40px]">
          <button
            onClick={() =>
              openExitConfirmDialog({
                onConfirm: () => {
                  gameStoreApi.persist?.clearStorage?.()
                  router.push("/")
                },
              })
            }
            className="flex h-[60px] w-[268px] flex-col items-center justify-center gap-2.5 p-3.5"
          >
            <Image
              src="/logo.svg"
              alt="홈 로고"
              className="size-full"
              width={268}
              height={60}
            />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <Progress
            value={progressValue}
            className="h-[25px] w-[1080px]"
            max={100}
          />
        </div>

        <div className="flex w-[420px] flex-col items-end justify-center gap-2.5">
          <div className="flex items-center justify-end gap-4 px-10">
            <SecondaryGhostIconButton>
              <Sun />
            </SecondaryGhostIconButton>

            {currentRound > 1 && (
              <PrimaryBoxButton
                size="sm"
                _style="solid"
                onClick={handlePrevQuestion}
              >
                이전 문제
              </PrimaryBoxButton>
            )}

            <PrimaryBoxButton
              size="sm"
              _style="solid"
              onClick={handleNextQuestion}
            >
              다음 문제
            </PrimaryBoxButton>

            <SecondaryPlainIconButton
              size="lg"
              onClick={() =>
                openExitConfirmDialog({
                  onConfirm: () => {
                    gameStoreApi.persist?.clearStorage?.()
                    router.push("/")
                  },
                })
              }
              aria-label="게임 종료"
            >
              <Cross />
            </SecondaryPlainIconButton>
          </div>
        </div>
      </div>

      {/* < className="flex">
        {/* 사이드바 */}
      <div className="absolute left-[20px] top-[110px] flex max-h-[940px] w-[400px] min-w-[400px] flex-col rounded-[20px] bg-background-tertiary">
        <div className="relative flex items-center justify-center py-6">
          <span className="typography-heading-sm-bold text-text-primary">
            점수판
          </span>
          <PrimarySolidIconButton
            className="absolute right-9 top-4"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="점수판 토글"
          >
            {isSidebarOpen ? <Show /> : <Hidden />}
          </PrimarySolidIconButton>
        </div>
        {isSidebarOpen && (
          <div className="flex max-h-[850px] flex-1 flex-col items-center gap-6 overflow-y-scroll px-[25px] py-6">
            {teams.map((team) => (
              <PlayerStatus
                key={team.id}
                name={team.name}
                score={`${team.score}점`}
                onScoreIncrease={() => handleIncreaseScore(team.id)}
                onScoreDecrease={() => handleDecreaseScore(team.id)}
                className="min-h-[118px]"
              />
            ))}
          </div>
        )}
      </div>
      <div>
        {/* 메인 컨텐츠 영역 */}
        <div className="flex w-full flex-1 flex-col items-center justify-center">
          {/* Question Text */}
          <h1 className="typography-heading-4xl-bold mb-[118px] max-w-[1080px] text-center text-text-primary">
            {currentQuestion?.questionText || "질문을 불러오는 중..."}
          </h1>

          {currentQuestion?.imageUrl && (
            <div className="relative mb-[85px] min-h-[459px] w-[727px] overflow-hidden rounded-[10px]">
              <Image
                src={currentQuestion.imageUrl}
                alt="문제 이미지"
                className="size-full rounded-[10px] object-contain transition-opacity duration-300"
                fill
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzI3IiBoZWlnaHQ9IjQ1OSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
                loading="eager"
                sizes="(max-width: 1920px) 727px, 1454px"
              />
            </div>
          )}

          {/* Answer Section */}
          {showAnswer ? (
            <SecondaryOutlineBoxButton size="lg" onClick={handleShowAnswer}>
              {currentQuestion?.questionAnswer}
            </SecondaryOutlineBoxButton>
          ) : (
            <PrimaryBoxButton
              size="2xl"
              _style="solid"
              onClick={handleShowAnswer}
            >
              정답 보기
            </PrimaryBoxButton>
          )}
        </div>
      </div>
    </>
  )
}

export default ScoreboardGame
