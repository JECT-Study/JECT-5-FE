"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"

import { useAuthStore } from "@/entities/auth"

function KakaoCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuthStore()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code")
      const error = searchParams.get("error")

      if (error || !code)
        throw new Error(error || "인증 코드를 받지 못했습니다.")

      login(code)
      router.push("/")
    }

    handleCallback()
  }, [searchParams, login, router])

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
            <div className="mb-4">페이지를 준비하고 있습니다</div>
            <div className="mx-auto size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          </div>
        </div>
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  )
}
