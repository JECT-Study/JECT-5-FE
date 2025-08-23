"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useShallow } from "zustand/react/shallow"

import { useGameStore } from "../../store/useGameStore"

interface GamePlayGuardProps {
  children: React.ReactNode
}

//gameStatus가 playing이 아니면 setup으로 리다이렉트
//query params 검증
export default function GamePlayGuard({ children }: GamePlayGuardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { gameStatus, totalRounds } = useGameStore(
    useShallow((state) => ({
      gameStatus: state.gameStatus,
      totalRounds: state.gameDetail?.questionCount,
    })),
  )

  // URL 파라미터 검증
  const q = Number(searchParams.get("q") || "1")
  if (q < 1 || q > totalRounds) {
    throw new Error("유효한 문제 번호가 아닙니다.")
  }

  // 게임 상태 기반 리디렉션
  useEffect(() => {
    if (gameStatus !== "playing") {
      router.replace(`./setup`)
    }
  }, [gameStatus, router])

  return <>{children}</>
}
