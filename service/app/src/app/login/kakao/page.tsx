"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function KakaoLoginPage() {
  const router = useRouter()

  useEffect(() => {
    const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
    const redirectUri =
      process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ||
      `${window.location.origin}/login/kakao`

    if (!kakaoClientId) {
      console.error("KAKAO_CLIENT_ID is not defined")
      return
    }

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`

    window.location.href = kakaoAuthUrl
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4">카카오 로그인으로 이동 중...</div>
        <div className="mx-auto size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    </div>
  )
}
