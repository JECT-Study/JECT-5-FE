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

interface HomeNavigationProps {
  isLoggedIn?: boolean
  className?: string
}

export const HomeNavigation = ({ className = "" }: HomeNavigationProps) => {
  const router = useRouter()
  const { isLoading: authLoading, isAuthenticated, logout, login } = useAuth()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [listButton, setListButton] = useState(false)
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

  const handleAvatarClick = () => {
    setListButton(!listButton)
  }

  const handleAvatarKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setListButton(!listButton)
    } else if (event.key === "Escape" && listButton) {
      setListButton(false)
    }
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

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (listButton && !target.closest("[data-user-menu]")) {
        setListButton(false)
      }
    }

    if (listButton) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [listButton])

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

              <div className="relative" data-user-menu>
                <button
                  className="flex size-[42px] cursor-pointer items-center justify-center rounded-full bg-gray-300 focus:outline-none"
                  onClick={handleAvatarClick}
                  onKeyDown={handleAvatarKeyDown}
                  aria-label={`사용자 메뉴 ${listButton ? "닫기" : "열기"}`}
                  aria-expanded={listButton}
                  aria-haspopup="true"
                  tabIndex={0}
                >
                  <Image
                    src="/avatar.svg"
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
                      aria-label="로그아웃"
                      tabIndex={0}
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
