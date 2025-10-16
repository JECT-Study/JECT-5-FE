"use client"

import { useRouter } from "next/navigation"

import { useAuthStore } from "@/entities/auth"
import AvatarButton from "@/widgets/components/avatarButton"
import { KakaoLoginButton } from "@/widgets/components/kakaoLoginButton"

/**
 *
 * next/dynamic을 사용해서 렌더링해야 hydration error를 방지할 수 있음
 * @example const HomeNavigationRightContent = dynamic(
  () => import("./"),
  { ssr: false },
)
 */
export default function AuthButton() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuthStore()

  const handleLogin = () => {
    router.push("/login")
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      {isAuthenticated ? (
        <AvatarButton onClick={handleLogout} />
      ) : (
        <KakaoLoginButton onClick={handleLogin} />
      )}
    </>
  )
}
