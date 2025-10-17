"use client"

import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"
import { ThemeToggle } from "@ject-5-fe/design/components/themeToggle"
import { Add } from "@ject-5-fe/design/icons"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

import { useAuthStore } from "@/entities/auth"

const LoginButton = dynamic(() => import("@/shared/authButton"), {
  ssr: false,
})

export default function HomeNavigationRightContent() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  const handleMyGamesClick = () => {
    router.push("/dashboard")
  }

  const handleCreateGameClick = () => {
    router.push("/create")
  }

  return (
    <>
      {isAuthenticated && (
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
          >
            <Add aria-hidden="true" />
            게임 만들기
          </PrimaryBoxButton>
        </>
      )}
      <LoginButton />
      <ThemeToggle />
    </>
  )
}
