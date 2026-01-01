import { Suspense } from "react"

import { KakaoLoginClient } from "./kakaoLoginClient"

export default function KakaoLoginPage({
  searchParams,
}: {
  searchParams: { returnTo?: string }
}) {
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
      <KakaoLoginClient returnTo={searchParams.returnTo} />
    </Suspense>
  )
}
