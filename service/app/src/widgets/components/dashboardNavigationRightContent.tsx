"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import { Add } from "@shared/design/src/icons"
import { useRouter } from "next/navigation"

import { useAuthStore } from "@/entities/auth"
import { ThemeToggle } from "@/shared/themeToggleButton"

import AvatarButton from "./avatarButton"

export default function DashboardNavigationRightContent() {
  const router = useRouter()
  const { logout } = useAuthStore()

  const handleCreateGame = () => {
    router.push("/create")
  }

  const handleLogoutClick = () => {
    logout()
    router.push("/")
  }

  return (
    <>
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

      <ThemeToggle />
    </>
  )
}
