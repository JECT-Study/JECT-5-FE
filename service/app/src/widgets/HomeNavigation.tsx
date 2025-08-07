"use client"

import {
  PrimaryBoxButton,
  SecondaryGhostIconButton,
  SecondaryOutlineBoxButton,
} from "@shared/design/src/components/button"
import { Add, Sun } from "@shared/design/src/icons"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface HomeNavigationProps {
  isLoggedIn?: boolean
  className?: string
}

export const HomeNavigation = ({
  isLoggedIn = false,
  className = "",
}: HomeNavigationProps) => {
  const router = useRouter()

  const handleMyGamesClick = () => {}

  const handleCreateGameClick = () => {
    router.push("/create")
  }

  const handleThemeToggle = () => {}

  const handleAvatarClick = () => {}

  const handleLoginClick = () => {}

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
            width={268}
            height={60}
          />
        </div>
      </div>

      <div className="flex w-[420px] flex-col items-end justify-center gap-2.5">
        <div className="flex items-center gap-4 px-10">
          {isLoggedIn ? (
            <>
              <PrimaryBoxButton
                size="sm"
                _style="solid"
                onClick={handleMyGamesClick}
              >
                내 게임
              </PrimaryBoxButton>

              <PrimaryBoxButton
                size="sm"
                _style="solid"
                onClick={handleCreateGameClick}
              >
                <Add className="size-6" />
                게임 만들기
              </PrimaryBoxButton>

              <div
                className="flex size-[42px] cursor-pointer items-center justify-center rounded-full bg-gray-300"
                onClick={handleAvatarClick}
              >
                <Image
                  src="/avatar.svg"
                  alt="사용자 아바타"
                  className="size-full rounded-full"
                  width={42}
                  height={42}
                />
              </div>
            </>
          ) : (
            <>
              <SecondaryOutlineBoxButton size="md" onClick={handleLoginClick}>
                <Image
                  src="/kakao-logo.png"
                  alt="카카오 로고"
                  className="size-8"
                  width={32}
                  height={32}
                />
                간편로그인해서 게임 만들기
              </SecondaryOutlineBoxButton>
            </>
          )}

          <SecondaryGhostIconButton onClick={handleThemeToggle}>
            <Sun />
          </SecondaryGhostIconButton>
        </div>
      </div>
    </nav>
  )
}
