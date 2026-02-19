import { useMemo } from "react"

import type { Team } from "../../store/useGameStore"

interface GameResultContentProps {
  teams: Team[]
  scores: Record<string, number>
}

export const GameResultContent = ({
  teams,
  scores,
}: GameResultContentProps) => {
  // 점수 내림차순으로 정렬하여 상위 3팀 추출
  const topTeams = useMemo(() => {
    return [...teams].sort((a, b) => scores[b.id] - scores[a.id]).slice(0, 3)
  }, [teams, scores])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-40">
      {/* Winner Title */}
      <div className="flex items-center justify-center rounded-[15px] bg-blue-400 px-32 py-20">
        <h2 className="typography-heading-3xl-semibold text-neutral-white">
          🎉 이번 게임의 Winner는?
        </h2>
      </div>

      {/* Scoreboard */}
      <div className="flex flex-col gap-6">
        {topTeams.map((team) => (
          <div
            key={team.id}
            className="flex items-center justify-center gap-[30px] rounded-[10px] bg-gray-100 px-[110px] py-12"
          >
            <span className="text-[57px] font-extrabold text-blue-700">
              {team.name}
            </span>
            <span className="text-[57px] font-extrabold text-blue-400">
              {scores[team.id]}점
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
