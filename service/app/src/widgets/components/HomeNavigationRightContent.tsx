"use client"

import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"
import { Add } from "@ject-5-fe/design/icons"
import dynamic from "next/dynamic"

import { useAuthStore } from "@/entities/auth"
import { ThemeToggle } from "@/shared/themeToggleButton"

const LoginButton = dynamic(() => import("@/shared/authButton"), {
  ssr: false,
})

import Link from "next/link"

export default function HomeNavigationRightContent() {
  const { authStatus } = useAuthStore()

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
        </>
      ) : (
        <LoginButton />
      )}
      <ThemeToggle />
    </>
  )
}
