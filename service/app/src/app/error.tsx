"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import Link from "next/link"

export default function Error() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-primary">
      <div className="flex flex-col items-center gap-8 text-center">
        <p className="typography-heading-lg-semibold text-text-primary">
          페이지를 불러오는 중 오류가 발생했습니다.
        </p>
        <div className="flex items-center gap-2">
          <PrimaryBoxButton size="md" asChild>
            <Link href="/">다시 시도</Link>
          </PrimaryBoxButton>
        </div>
      </div>
    </div>
  )
}
