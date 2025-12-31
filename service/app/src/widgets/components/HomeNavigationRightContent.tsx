"use client"

import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"
import { Add } from "@ject-5-fe/design/icons"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { useAuthStore } from "@/entities/auth"
import { ThemeToggle } from "@/shared/themeToggleButton"

import AvatarButton from "./avatarButton"
import { KakaoLoginButton } from "./kakaoLoginButton"

export default function HomeNavigationRightContent() {
  const { authStatus, user, logout } = useAuthStore()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const returnTo = `${pathname}${searchParams.toString() ? `?${searchParams}` : ""}`

  return (
    <>
      {authStatus === "authenticated" ? (
        <>
          <PrimaryBoxButton size="sm" _style="solid" asChild>
            <Link href="/dashboard">내 게임</Link>
          </PrimaryBoxButton>
          <PrimaryBoxButton size="sm" _style="solid" asChild>
            <Link href="/create">
              <Add aria-hidden="true" />
              게임 만들기
            </Link>
          </PrimaryBoxButton>
          <AvatarButton src={user?.profileImageUrl} onClick={logout} />
        </>
      ) : (
        <KakaoLoginButton returnTo={returnTo} />
      )}
      <ThemeToggle />
    </>
  )
}
