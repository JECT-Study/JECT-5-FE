"use client"

import {
  PrimaryBoxButton,
  SecondaryGhostIconButton,
  SecondaryOutlineBoxButton,
} from "@shared/design/src/components/button"
import { Add, Sun } from "@shared/design/src/icons"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { useAuth } from "@/entities/auth"

interface HomeNavigationProps {
  isLoggedIn?: boolean
  className?: string
}

export const HomeNavigation = ({ className = "" }: HomeNavigationProps) => {
  const router = useRouter()
  const {
    user,
    isLoading: authLoading,
    isAuthenticated,
    logout,
    login,
  } = useAuth()
  const [listButton, setListButton] = useState(false)

  const handleMyGamesClick = () => {
    router.push("/dashboard")
  }

  const handleCreateGameClick = () => {
    router.push("/create")
  }

  const handleThemeToggle = () => {}

  const handleAvatarClick = () => {
    setListButton(!listButton)
  }

  const handleLoginClick = async () => {
    if (process.env.NODE_ENV === "development") {
      try {
        await login("someValidCode")
      } catch (error) {
        console.error("Login error:", error)
      }
      return
    }

    window.location.href = "/login"
  }

  const handleLogoutClick = () => {
    logout()
    setListButton(false)
  }

  return (
    <nav
      className={`flex h-[110px] w-full items-center justify-between bg-background-tertiary ${className}`}
    >
      <div className="flex w-[420px] items-center gap-2.5 px-10">
        <button
          className="flex h-[60px] w-[268px] cursor-pointer items-center justify-center p-3.5"
          onClick={() => router.push("/")}
          aria-label="홈으로 이동"
        >
          <Image
            src="/logo.svg"
            alt="홈 로고"
            className="size-full"
            width={268}
            height={60}
          />
        </button>
      </div>

      <div className="flex w-[420px] flex-col items-end justify-center gap-2.5">
        <div className="flex items-center gap-4 px-10">
          {isAuthenticated ? (
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

              <div className="relative">
                <button
                  className="flex size-[42px] cursor-pointer items-center justify-center rounded-full bg-gray-300"
                  onClick={handleAvatarClick}
                  aria-label="사용자 메뉴 열기"
                  aria-expanded={listButton}
                  aria-haspopup="true"
                >
                  <Image
                    src={user?.profileImageUrl || "/avatar.svg"}
                    alt="사용자 아바타"
                    className="size-full rounded-full"
                    width={42}
                    height={42}
                  />
                </button>
                {listButton && (
                  <div
                    className="absolute right-0 top-full z-10 mt-2"
                    role="menu"
                    aria-label="사용자 메뉴"
                  >
                    <SecondaryOutlineBoxButton
                      size="md"
                      onClick={handleLogoutClick}
                      className="whitespace-nowrap"
                      role="menuitem"
                    >
                      로그아웃
                    </SecondaryOutlineBoxButton>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <SecondaryOutlineBoxButton
                size="md"
                onClick={handleLoginClick}
                disabled={authLoading}
              >
                <Image
                  src="/kakao-logo.svg"
                  alt="카카오 로고"
                  className="size-8"
                  width={32}
                  height={32}
                />
                간편로그인해서 게임 만들기
              </SecondaryOutlineBoxButton>
            </>
          )}

          <SecondaryGhostIconButton
            onClick={handleThemeToggle}
            aria-label="라이트/다크 모드 전환"
          >
            <Sun />
          </SecondaryGhostIconButton>
        </div>
      </div>
    </nav>
  )
}
