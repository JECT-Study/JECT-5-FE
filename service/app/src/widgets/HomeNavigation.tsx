"use client"

import {
  PrimaryBoxButton,
  SecondaryOutlineBoxButton,
} from "@shared/design/src/components/button"
import { ThemeToggle } from "@shared/design/src/components/themeToggle"
import { Add } from "@shared/design/src/icons"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { useAuth } from "@/entities/auth"

import AvatarButton from "./components/avatarButton"

interface HomeNavigationProps {
  isLoggedIn?: boolean
  className?: string
}

export const HomeNavigation = ({ className = "" }: HomeNavigationProps) => {
  const router = useRouter()
  const { isLoading: authLoading, isAuthenticated, logout, login } = useAuth()
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
            <>
              <SecondaryOutlineBoxButton
                size="md"
                onClick={handleLoginClick}
                disabled={authLoading}
                aria-label="카카오 간편 로그인 버튼"
                aria-busy={authLoading}
              >
                <Image
                  src="/kakao-logo.svg"
                  alt="카카오 로고"
                  className="size-8"
                  width={32}
                  height={32}
                  aria-hidden="true"
                />
                간편로그인해서 게임 만들기
              </SecondaryOutlineBoxButton>
            </>
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
