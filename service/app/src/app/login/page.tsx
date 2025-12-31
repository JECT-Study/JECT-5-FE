"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

import { MSW_MOCK_CODE } from "@/mocks/handlers/auth"
import { ENTRY_KEYS, saveEntry } from "@/shared/lib/saveEntry"

export default function KakaoLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI

  useEffect(() => {
    const returnTo = searchParams.get("returnTo")
    if (returnTo) saveEntry(ENTRY_KEYS.auth, returnTo)

    if (process.env.NODE_ENV === "development") {
      router.replace(`/login/kakao/?code=${MSW_MOCK_CODE}`)
      return
    }

    if (!kakaoClientId || !redirectUri) return

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`

    router.replace(kakaoAuthUrl)
  }, [router, kakaoClientId, redirectUri, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-primary">
      <div className="flex flex-col items-center gap-16">
        <div className="size-32 animate-spin rounded-full border-4 border-blue-400 border-t-transparent"></div>
        <p className="text-sm text-text-primary">
          카카오 로그인으로 이동 중...
        </p>
      </div>
    </div>
  )
}
