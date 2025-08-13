"use client"

import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"
import { Cross, Sun } from "@ject-5-fe/design/icons"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useMemo } from "react"

import { useGameStore } from "../store/useGameStore"

export default function GameResultPage() {
  const router = useRouter()
  const params = useParams()
  const { teams, totalRounds } = useGameStore((state) => state)

  // 점수 내림차순으로 정렬하여 상위 3팀 추출
  const topTeams = useMemo(() => {
    return [...teams]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((team) => ({
        name: team.name,
        score: team.score,
      }))
  }, [teams])

  const handleGoHome = () => {
    router.push("/")
  }

  const handlePreviousQuestion = () => {
    // 이전 문제로 이동 (마지막 문제에서 이전 문제로)
    const previousRound = Math.max(1, totalRounds - 1)
    router.push(`/game/${params.gameId}/play?q=${previousRound}`)
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background-primary">
      {/* Navigation */}
      <div className="mx-auto flex h-[110px] w-[1920px] shrink-0 items-center justify-between">
        <div className="flex w-[420px] items-center gap-[10px] self-stretch px-[40px]">
          <button
            onClick={handleGoHome}
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

        <h1 className="typography-heading-lg-semibold whitespace-nowrap text-center text-text-primary">
          게임 종료
        </h1>

        <div className="flex w-[420px] flex-col items-end justify-center gap-2.5">
          <div className="flex items-center justify-end gap-4 px-10">
            <button className="flex items-center justify-center gap-2.5 rounded-lg p-2.5">
              <Sun size={24} className="text-icon-interactive-secondary" />
            </button>
            <PrimaryBoxButton
              size="sm"
              _style="solid"
              onClick={handlePreviousQuestion}
            >
              이전 문제
            </PrimaryBoxButton>
            <button className="flex size-8 items-center justify-center">
              <Cross size={32} className="text-icon-interactive-secondary" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-10">
        {/* Winner Title */}
        <div className="flex h-24 items-center justify-center gap-2.5 rounded-[15px] bg-blue-400 px-8 py-2.5">
          <h2 className="typography-heading-3xl-semibold text-neutral-white">
            🎉 이번 게임의 Winner는?
          </h2>
        </div>

        {/* Scoreboard */}
        <div className="flex flex-col gap-6">
          {topTeams.map((team) => (
            <div
              key={team.name}
              className="flex items-center justify-center gap-[30px] rounded-[10px] bg-gray-100 px-[110px] py-[18px]"
            >
              <span className="text-[57px] font-bold text-blue-700">
                {team.name}
              </span>
              <span className="text-[57px] font-bold text-blue-400">
                {team.score}점
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
