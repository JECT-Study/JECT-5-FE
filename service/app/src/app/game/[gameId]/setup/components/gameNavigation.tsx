import {
  PrimaryBoxButton,
  SecondaryGhostIconButton,
  SecondaryPlainIconButton,
} from "@ject-5-fe/design/components/button"
import { Cross, Sun } from "@ject-5-fe/design/icons"
import Image from "next/image"
import Link from "next/link"

interface GameNavigationProps {
  onStart: () => void
  onExit: () => void
  canStart: boolean
}

export function GameNavigation({
  onStart,
  onExit,
  canStart,
}: GameNavigationProps) {
  return (
    <div className="mx-auto flex h-[110px] w-[1920px] shrink-0 items-center justify-between">
      <div className="flex w-[420px] items-center gap-[10px] self-stretch px-[40px]">
        <Link
          href="/"
          className="flex h-[60px] w-[268px] flex-col items-center justify-center gap-2.5 p-3.5"
        >
          <Image
            src="/logo.svg"
            alt="홈 로고"
            className="size-full"
            width={268}
            height={60}
          />
        </Link>
      </div>

      <h1 className="typography-heading-lg-semibold whitespace-nowrap text-center text-text-primary">
        참가자 설정
      </h1>

      <div className="flex w-[420px] flex-col items-end justify-center gap-2.5">
        <div className="flex items-center justify-end gap-4 px-10">
          <SecondaryGhostIconButton>
            <Sun />
          </SecondaryGhostIconButton>
          <PrimaryBoxButton
            size="sm"
            _style="solid"
            disabled={canStart}
            onClick={onStart}
          >
            게임 시작
          </PrimaryBoxButton>
          <SecondaryPlainIconButton size="lg" onClick={onExit}>
            <Cross />
          </SecondaryPlainIconButton>
        </div>
      </div>
    </div>
  )
}
