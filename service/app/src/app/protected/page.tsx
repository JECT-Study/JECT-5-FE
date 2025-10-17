import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"
import Link from "next/link"

export default function ProtectedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-primary">
      <div className="flex flex-col items-center gap-8 text-center">
        <p className="typography-heading-lg-semibold text-text-primary">
          해당 페이지는 로그인이 필요합니다.
        </p>
        <div className="flex items-center gap-2">
          <PrimaryBoxButton size="md" asChild>
            <Link href="/">홈으로 이동</Link>
          </PrimaryBoxButton>
        </div>
      </div>
    </div>
  )
}
