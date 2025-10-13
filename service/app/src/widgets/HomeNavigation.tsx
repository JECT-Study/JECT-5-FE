"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import { Navigation } from "@shared/design/src/components/navigation"
import { Add } from "@shared/design/src/icons"
import { useRouter } from "next/navigation"

import { useAuthStore } from "@/entities/auth"
import { ThemeToggle } from "@/shared/themeToggleButton"

import AvatarButton from "./components/avatarButton"
import { HomeButton } from "./components/homeButton"
import { KakaoLoginButton } from "./components/kakaoLoginButton"

interface HomeNavigationProps {
  isLoggedIn?: boolean
  className?: string
}

export const HomeNavigation = ({ className = "" }: HomeNavigationProps) => {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuthStore()
  const handleMyGamesClick = () => {
    router.push("/dashboard")
  }

  const handleCreateGameClick = () => {
    router.push("/create")
  }

  const handleLogoutClick = () => {
    logout()
  }

  const handleKakaoLogin = () => {
    router.push("/login")
  }

  return (
    <Navigation
      className={className}
      leftContent={<HomeButton />}
      rightContent={
        <>
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
              >
                <Add aria-hidden="true" />
                게임 만들기
              </PrimaryBoxButton>

              <AvatarButton onClick={handleLogoutClick} />
            </>
          ) : (
            <KakaoLoginButton onClick={handleKakaoLogin} />
          )}
          <ThemeToggle />
        </>
      }
    />
  )
}
