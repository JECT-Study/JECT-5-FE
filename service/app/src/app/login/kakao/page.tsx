"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

import { useAuth } from "@/entities/auth"

function KakaoCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code")
      const error = searchParams.get("error")

      if (error) {
        setError("카카오 로그인 중 오류가 발생했습니다.")
        return
      }

      if (!code) {
        setError("인증 코드를 받지 못했습니다.")
        return
      }

      try {
        await login(code)
        // 로그인 성공 후 홈페이지로 리다이렉트
        router.push("/")
      } catch (error) {
        console.error("Login error:", error)
        setError("로그인 처리 중 오류가 발생했습니다.")
      }
    }

    handleCallback()
  }, [searchParams, login, router])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-600">{error}</div>
          <button
            onClick={() => router.push("/")}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4">카카오 로그인 처리 중...</div>
        <div className="mx-auto size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    </div>
  )
}

export default function KakaoCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4">로딩 중...</div>
            <div className="mx-auto size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          </div>
        </div>
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  )
}
