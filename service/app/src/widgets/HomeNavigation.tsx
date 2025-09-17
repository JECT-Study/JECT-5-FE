"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import { ThemeToggle } from "@shared/design/src/components/themeToggle"
import { Add } from "@shared/design/src/icons"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { useAuthStore } from "@/entities/auth"

import AvatarButton from "./components/avatarButton"
import { HomeButton } from "./components/homeButton"
import { KakaoLoginButton } from "./components/kakaoLoginButton"

interface HomeNavigationProps {
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

  const leftContent = <HomeButton />

  const rightContent = (
    <div className="flex items-center justify-end gap-4">
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
  )

  return (
    <nav
      className={`flex h-[90px] w-full shrink-0 items-center justify-between px-10 ${className}`}
    >
      {leftContent}
      {rightContent}
    </nav>
  )
}
