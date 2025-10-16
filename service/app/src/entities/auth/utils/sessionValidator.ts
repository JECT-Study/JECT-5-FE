import type { GameListData } from "@/entities/game"
import { fetchClient, isError } from "@/shared/api/fetchClient"

/**
 * 세션 검증을 위한 유틸리티
 * 실제 서버에 세션 검증 API가 없으므로, 간단한 API 요청으로 세션 상태를 확인 - 추후 실제 세션 검증 api로 교체 필요
 */

interface SessionValidationResult {
  isValid: boolean
  error?: string
}

export const validateSessionWithRequest =
  async (): Promise<SessionValidationResult> => {
    try {
      // 간단한 API 요청으로 세션 상태 확인 (예: 내 게임 목록 조회)
      await fetchClient.get<GameListData>("/users/me/games?limit=1", {
        method: "GET",
      })

      return {
        isValid: true,
      }
    } catch (error) {
      console.error("Session validation error:", error)
      if (isError(error) && error.response.status === 401) {
        return {
          isValid: false,
          error: "session expired",
        }
      }
      return {
        isValid: false,
        error: "unknown error",
      }
    }
  }

export const startPeriodicSessionValidation = (
  intervalMs: number = 5 * 60 * 1000,
  onSessionExpired?: () => void,
): (() => void) => {
  const intervalId = setInterval(async () => {
    const result = await validateSessionWithRequest()

    if (!result.isValid) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_user")
        document.cookie =
          "JSESSIONID=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;"

        window.dispatchEvent(new CustomEvent("auth:session-expired"))

        if (onSessionExpired) {
          onSessionExpired()
        }
      }
    }
  }, intervalMs)

  return () => {
    clearInterval(intervalId)
  }
}
