"use client"

import { useAuthStore } from "@/entities/auth"
import AvatarButton from "@/widgets/components/avatarButton"
import { KakaoLoginButton } from "@/widgets/components/kakaoLoginButton"

interface AuthButtonProps {
  onLogoutComplete?: () => void
}

export default function AuthButton({ onLogoutComplete }: AuthButtonProps = {}) {
  const { authStatus, logout, user } = useAuthStore()

  const handleLogout = () => {
    logout()
    onLogoutComplete?.()
  }

  const profileImageSrc = user?.profileImageUrl
    ? `/${user.profileImageUrl}`
    : "/checker.svg"

  return (
    <>
      {authStatus === "authenticated" ? (
        <AvatarButton src={profileImageSrc} onClick={handleLogout} />
      ) : (
        <KakaoLoginButton />
      )}
    </>
  )
}
