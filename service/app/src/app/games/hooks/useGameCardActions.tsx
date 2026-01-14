"use client"

//링크 복사 -> 게임 링크를 클립보드에 복사 -> toast띄우기
//복제 -> dialog띄우기 -> cloneGame -> 복제한게임을 /create로 이동

import { isHTTPError } from "ky"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { cloneGame } from "@/entities/game/api/cloneGame"

export const useActions = () => {
  const router = useRouter()
  const copy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link)
      toast("게임 링크를 클립보드에 복사하였습니다.")
    } catch (e) {
      toast("링크 복사에 실패했습니다")
    }
  }
  const clone = async (gameId: string) => {
    try {
      const clonedGame = await cloneGame(gameId)
      router.push(`/create?gameId=${clonedGame.data.gameId}`)
    } catch (e) {
      if (isHTTPError(e)) {
        switch (e.response.status) {
          case 401:
            toast.error("로그인이 필요합니다")
            router.push("/login")
            return
          case 404:
            toast.error("존재하지 않는 게임입니다")
            return
        }
      } else {
        toast.error("에러가 발생했습니다")
      }
    }
  }
  return { copy, clone }
}
