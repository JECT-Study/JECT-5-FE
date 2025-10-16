"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import { Add } from "@shared/design/src/icons"
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

      <AuthButton />

      <ThemeToggle />
    </>
  )
}
