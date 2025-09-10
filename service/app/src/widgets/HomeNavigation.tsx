"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import { ThemeToggle } from "@shared/design/src/components/themeToggle"
import { Add } from "@shared/design/src/icons"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { useAuthStore } from "@/entities/auth"

import AvatarButton from "./components/avatarButton"
import { KakaoLoginButton } from "./components/kakaoLoginButton"

interface HomeNavigationProps {
  isLoggedIn?: boolean
  className?: string
}

export const HomeNavigation = ({ className = "" }: HomeNavigationProps) => {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuthStore()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMyGamesClick = () => {
    router.push("/dashboard")
  }

  const handleCreateGameClick = () => {
    router.push("/create")
  }

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogoutClick = () => {
    logout()
  }

  const handleKakaoLogin = () => {
    router.push("/login")
  }

  return (
    <nav
      className={`flex h-[110px] w-full items-center justify-between bg-background-tertiary ${className}`}
      role="navigation"
      aria-label="메인 네비게이션"
    >
      <div className="flex w-[420px] items-center gap-2.5 px-10">
        <button
          className="flex h-[60px] w-[268px] cursor-pointer items-center justify-center p-3.5 focus:outline-none"
          onClick={() => router.push("/")}
          aria-label="홈으로 이동"
          tabIndex={0}
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
        <div
          className={`flex items-center gap-4 px-10 ${isAuthenticated ? "justify-end" : "justify-center"}`}
        >
          {isAuthenticated ? (
            <>
              <PrimaryBoxButton
                size="sm"
                _style="solid"
                onClick={handleMyGamesClick}
                aria-label="내 게임 관리 페이지로 이동"
              >
                내 게임
              </PrimaryBoxButton>

              <PrimaryBoxButton
                size="sm"
                _style="solid"
                onClick={handleCreateGameClick}
                aria-label="새 게임 만들기 페이지로 이동"
              >
                <Add className="size-6" aria-hidden="true" />
                게임 만들기
              </PrimaryBoxButton>

              <AvatarButton onClick={handleLogoutClick} />
            </>
          ) : (
            <KakaoLoginButton onClick={handleKakaoLogin} />
          )}
          {mounted && (
            <ThemeToggle
              theme={(resolvedTheme as "dark" | "light") || "light"}
              onThemeToggle={handleThemeToggle}
            />
          )}
        </div>
      </div>
    </nav>
  )
}
