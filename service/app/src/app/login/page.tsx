"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { MSW_MOCK_CODE } from "@/mocks/handlers/auth"

export default function KakaoLoginPage() {
  const router = useRouter()

  const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI

  useEffect(() => {
    if (!kakaoClientId || !redirectUri) return

    if (process.env.NODE_ENV === "development") {
      router.replace(`/login/kakao/?code=${MSW_MOCK_CODE}`)
      return
    }
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`

    router.replace(kakaoAuthUrl)
  }, [router, kakaoClientId, redirectUri])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="size-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent"></div>
        <p className="text-sm text-text-primary">
          카카오 로그인으로 이동 중...
        </p>
      </div>
    </div>
  )
}
