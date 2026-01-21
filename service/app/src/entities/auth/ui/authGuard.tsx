"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { useAuthStore } from "../store/useAuthStore"

interface AuthGuardProps {
  children: React.ReactNode
  /** 인증 확인 중 표시할 UI (기본값: null) */
  fallback?: React.ReactNode
  /** 리다이렉트 경로 (기본값: "/") */
  redirectTo?: string
  /** 인증 실패 메시지 (null이면 alert 비활성화) */
  unauthorizedMessage?: string | null
}

const DEFAULT_MESSAGE = "로그인이 필요합니다."
const DEFAULT_REDIRECT = "/"

export function AuthGuard({
  children,
  fallback = null,
  redirectTo = DEFAULT_REDIRECT,
  unauthorizedMessage = DEFAULT_MESSAGE,
}: AuthGuardProps) {
  const router = useRouter()
  const { authStatus } = useAuthStore()

  useEffect(() => {
    if (authStatus === "unknown") return
    if (authStatus !== "authenticated") {
      if (unauthorizedMessage !== null) {
        alert(unauthorizedMessage)
      }
      router.replace(redirectTo)
    }
  }, [authStatus, router, redirectTo, unauthorizedMessage])

  if (authStatus === "unknown") {
    return <>{fallback}</>
  }

  if (authStatus !== "authenticated") {
    return null
  }

  return <>{children}</>
}
