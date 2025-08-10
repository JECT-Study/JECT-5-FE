"use client"
import {
  PrimaryBoxButton,
  PrimarySolidIconButton,
  SecondaryGhostIconButton,
  SecondaryPlainIconButton,
} from "@ject-5-fe/design/components/button"
import { Cross, Show, Sun } from "@ject-5-fe/design/icons"
import { PlayerStatus } from "@shared/design/src/components/playerStatus"
import { useState } from "react"

const ScoreboardGame = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const teams = [
    "A팀가나다라마바사가나다라마바사",
    "B팀",
    "C팀",
    "D팀",
    "E팀",
    "F팀",
    "G팀",
    "G팀",
    "G팀",
  ]

  return (
    <div className="flex h-screen w-screen flex-col bg-background-primary">
      <div className="flex h-[110px] items-center justify-between">
        <div className="flex w-[420px] items-center gap-[10px] px-[40px]"></div>

        <div className="flex w-[420px] items-center justify-end gap-[16px] px-[40px]">
          <SecondaryGhostIconButton>
            <Sun />
          </SecondaryGhostIconButton>

          <PrimaryBoxButton size="sm" _style="solid">
            이전 문제
          </PrimaryBoxButton>

          <PrimaryBoxButton size="sm" _style="solid">
            다음 문제
          </PrimaryBoxButton>

          <SecondaryPlainIconButton size="lg">
            <Cross />
          </SecondaryPlainIconButton>
        </div>
      </div>

      {/* <div className="flex">
        {/* 사이드바 */}
      <div className="absolute left-[20px] top-[110px] flex max-h-[940px] w-[400px] min-w-[400px] flex-col rounded-[20px] bg-background-tertiary">
        <div className="relative flex items-center justify-center py-6">
          <span className="text-[19px] font-bold leading-[120%] text-text-primary">
            점수판
          </span>
          <PrimarySolidIconButton
            className="absolute right-9 top-4"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Show />
          </PrimarySolidIconButton>
        </div>
        {isSidebarOpen && (
          <div className="flex max-h-[850px] flex-1 flex-col items-center gap-6 overflow-y-scroll px-[25px] py-6">
            {teams.map((team, index) => (
              <PlayerStatus
                key={index}
                name={team}
                score="0점"
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
          <h1 className="mb-[118px] max-w-[1080px] text-center text-[57px] font-bold leading-[120%] text-text-primary">
            카드 단말기의 터치식 결제 기능의 명칭은?
          </h1>

          {/* Image Rectangle */}
          <div className="mb-[85px] h-[459px] w-[727px] rounded-[10px] bg-[lightgray] bg-cover bg-[50%] bg-no-repeat" />

          {/* Main Answer Button */}
          <PrimaryBoxButton size="2xl" _style="solid">
            정답 보기
          </PrimaryBoxButton>
        </div>
      </div>
    </div>
  )
}

export default ScoreboardGame
