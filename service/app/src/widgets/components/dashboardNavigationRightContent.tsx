"use client"

import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"
import { Add } from "@ject-5-fe/design/icons"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

import { ThemeToggle } from "@/shared/themeToggleButton"

const AuthButton = dynamic(() => import("@/shared/authButton"), {
  ssr: false,
})

export default function DashboardNavigationRightContent() {
  const router = useRouter()

  const handleCreateGame = () => {
    router.push("/create")
  }

  const handleLogoutComplete = () => {
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

      <AuthButton onLogoutComplete={handleLogoutComplete} />

      <ThemeToggle />
    </>
  )
}
