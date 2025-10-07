"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import * as Input from "@shared/design/src/components/input"
import { ThemeToggle } from "@shared/design/src/components/themeToggle"
import { Add } from "@shared/design/src/icons"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { useAuthStore } from "@/entities/auth"
import AvatarButton from "@/widgets/components/avatarButton"
import { HomeButton } from "@/widgets/components/homeButton"
import { KakaoLoginButton } from "@/widgets/components/kakaoLoginButton"

interface LibraryNavigationProps {
  className?: string
  searchQuery: string
  onSearchChange: (value: string) => void
}

export default function LibraryNavigation({
  className = "",
  searchQuery,
  onSearchChange,
}: LibraryNavigationProps) {
  const router = useRouter()
  const { logout, isAuthenticated } = useAuthStore()
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCreateGameClick = () => {
    router.push("/create")
  }

  const handleKakaoLogin = () => {
    router.push("/login")
  }

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const handleLogoutClick = () => {
    logout()
  }

  const leftContent = <HomeButton />

  const centerContent = (
    <Input.Root>
      <Input.Field type="leftIcon" state="default" name="search">
        <Input.Control
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="오늘의 추천 게임은?"
        />
      </Input.Field>
    </Input.Root>
  )

  const rightContent = (
    <div className="flex items-center justify-end gap-16">
      {isAuthenticated ? (
        <>
          <PrimaryBoxButton
            size="sm"
            _style="solid"
            onClick={handleCreateGameClick}
            aria-label="새 게임 만들기 페이지로 이동"
          >
            <Add aria-hidden="true" />
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
      {centerContent}
      {rightContent}
    </nav>
  )
}
