"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import { ThemeToggle } from "@shared/design/src/components/themeToggle"
import { Add } from "@shared/design/src/icons"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

import { useAuthStore } from "@/entities/auth"
import AvatarButton from "@/widgets/components/avatarButton"
import { KakaoLoginButton } from "@/widgets/components/kakaoLoginButton"

interface HomeNavigationClientProps {
  className?: string
}

export const HomeNavigationClient = ({
  className = "",
}: HomeNavigationClientProps) => {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuthStore()
  const { theme, setTheme, resolvedTheme } = useTheme()

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

  const rightContent = (
    <div className={`flex items-center justify-end gap-16 ${className}`}>
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
            <Add aria-hidden="true" />
            게임 만들기
          </PrimaryBoxButton>

          <AvatarButton onClick={handleLogoutClick} />
        </>
      ) : (
        <KakaoLoginButton onClick={handleKakaoLogin} />
      )}
      <ThemeToggle
        theme={(resolvedTheme as "dark" | "light") || "light"}
        onThemeToggle={handleThemeToggle}
      />
    </div>
  )

  return rightContent
}
