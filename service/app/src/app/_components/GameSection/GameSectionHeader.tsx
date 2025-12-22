import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"
import Link from "next/link"

export const GameSectionHeader = () => {
  return (
    <div className="flex w-full items-center justify-between">
      <h2 className="typography-heading-lg-semibold text-text-interactive-secondary">
        어떤 게임으로 시작해 볼까요?
      </h2>
      <PrimaryBoxButton size="md" _style="outline" asChild>
        <Link href="/games">게임 더 보기</Link>
      </PrimaryBoxButton>
    </div>
  )
}
