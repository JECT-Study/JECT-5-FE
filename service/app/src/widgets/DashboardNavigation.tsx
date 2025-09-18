"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import { ThemeToggle } from "@shared/design/src/components/themeToggle"
import { Add } from "@shared/design/src/icons"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { useAuthStore } from "@/entities/auth"
import AvatarButton from "@/widgets/components/avatarButton"

import { HomeButton } from "./components/homeButton"

interface DashboardNavigationProps {
  className?: string
}

export default function DashboardNavigation({
  className = "",
}: DashboardNavigationProps) {
  const router = useRouter()
  const { logout } = useAuthStore()
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const handleLogoutClick = () => {
    logout()
    router.push("/")
  }

  const handleCreateGame = () => {
    router.push("/create")
  }

  const leftContent = <HomeButton />

  const centerContent = (
    <h1 className="typography-heading-lg-semibold text-text-primary">
      내 게임
    </h1>
  )

  const rightContent = (
    <div className="flex items-center justify-end gap-16">
      <PrimaryBoxButton
        size="sm"
        _style="solid"
        onClick={handleCreateGame}
        aria-label="게임 만들기"
      >
        <Add />
        게임 만들기
      </PrimaryBoxButton>

      <AvatarButton onClick={handleLogoutClick} />

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
