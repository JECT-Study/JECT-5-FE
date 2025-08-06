"use client"

import { PrimaryBoxButton, SecondaryGhostIconButton } from "@shared/design/src/components/button"
import { Add, Sun } from "@shared/design/src/icons"
import Image from "next/image"

interface HomeNavigationProps {
  onMyGamesClick?: () => void
  onCreateGameClick?: () => void
  onThemeToggle?: () => void
  onAvatarClick?: () => void
  className?: string
}

export const HomeNavigation = ({
  onMyGamesClick,
  onCreateGameClick,
  onThemeToggle,
  onAvatarClick,
  className = "",
}: HomeNavigationProps) => {
  return (
    <nav
      className={`flex h-[110px] w-full items-center justify-between bg-background-tertiary ${className}`}
    >
      <div className="flex w-[420px] items-center gap-2.5 px-10">
        <div className="flex h-[60px] w-[268px] cursor-pointer items-center justify-center p-3.5">
          <Image
            src="/logo.svg"
            alt="홈 로고"
            className="size-full"
          />
        </div>
      </div>

      <div className="flex w-[420px] flex-col items-end justify-center gap-2.5">
        <div className="flex items-center gap-4 px-10">
          <PrimaryBoxButton
            size="sm"
            _style="solid"
            onClick={onMyGamesClick}
          >
            내 게임
          </PrimaryBoxButton>

          <PrimaryBoxButton
            size="sm"
            _style="solid"
            onClick={onCreateGameClick}
          >
            <Add className="size-6" />
            게임 만들기
          </PrimaryBoxButton>

          <div
            className="flex size-[42px] cursor-pointer items-center justify-center rounded-full bg-gray-300"
            onClick={onAvatarClick}
          >
            <Image
              src="/avatar.svg"
              alt="사용자 아바타"
              className="size-full rounded-full"
            />
          </div>

          <SecondaryGhostIconButton
            onClick={onThemeToggle}
          >
            <Sun />
          </SecondaryGhostIconButton>
        </div>
      </div>
    </nav>
  )
} 