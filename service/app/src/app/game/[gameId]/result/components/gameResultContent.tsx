import { useMemo } from "react"

import type { Team } from "../../store/useGameStore"

interface GameResultContentProps {
  teams: Team[]
}

export const GameResultContent = ({ teams }: GameResultContentProps) => {
  // 점수 내림차순으로 정렬하여 상위 3팀 추출
  const topTeams = useMemo(() => {
    return [...teams].sort((a, b) => b.score - a.score).slice(0, 3)
  }, [teams])

  return (
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
            key={team.id}
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
  )
}
