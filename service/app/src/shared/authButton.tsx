"use client"

import { useRouter } from "next/navigation"

import { useAuthStore } from "@/entities/auth"
import AvatarButton from "@/widgets/components/avatarButton"
import { KakaoLoginButton } from "@/widgets/components/kakaoLoginButton"

interface AuthButtonProps {
  onLogoutComplete?: () => void
}

/**
 *
 * next/dynamic을 사용해서 렌더링해야 hydration error를 방지할 수 있음
 * @example const HomeNavigationRightContent = dynamic(
  () => import("./"),
  { ssr: false },
)
 */
export default function AuthButton({ onLogoutComplete }: AuthButtonProps = {}) {
  const router = useRouter()
  const { isAuthenticated, logout, user } = useAuthStore()

  const handleLogin = () => {
    router.push("/login")
  }

  const handleLogout = () => {
    logout()
    onLogoutComplete?.()
  }

  const profileImageSrc = user?.profileImageUrl
    ? `/${user.profileImageUrl}`
    : "/checker.svg"

  return (
    <>
      {isAuthenticated ? (
        <AvatarButton src={profileImageSrc} onClick={handleLogout} />
      ) : (
        <KakaoLoginButton onClick={handleLogin} />
      )}
    </>
  )
}
