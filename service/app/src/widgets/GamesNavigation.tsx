"use client"

import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"
import { Navigation } from "@ject-5-fe/design/components/navigation"
import * as TextField from "@ject-5-fe/design/components/textField"
import { Add, Magnifier } from "@ject-5-fe/design/icons"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { parseAsString, useQueryState } from "nuqs"
import { type ChangeEvent, useState } from "react"
import { useDebounce } from "react-simplikit"

import { useAuthStore } from "@/entities/auth"
import { ThemeToggle } from "@/shared/themeToggleButton"

import AvatarButton from "./components/avatarButton"
import { HomeButton } from "./components/homeButton"
import { KakaoLoginButton } from "./components/kakaoLoginButton"

interface GamesNavigationProps {
  className?: string
}

export const GamesNavigation = ({ className }: GamesNavigationProps) => {
  const [query, setQuery] = useQueryState(
    "query",
    parseAsString.withDefault(""),
  ) //실제 url에 반영될 상태 - debounce
  const [localQuery, setLocalQuery] = useState(query) //유저의 입력에 적용될 상태
  const { authStatus, user, logout } = useAuthStore()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const returnTo = `${pathname}${searchParams.toString() ? `?${searchParams}` : ""}`
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const debouncedUpdateQuery = useDebounce((value: string) => {
    setQuery(value)
  }, 300)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setLocalQuery(value)
    debouncedUpdateQuery(value)
  }

  return (
    <Navigation
      className={className}
      leftContent={<HomeButton />}
      centerContent={
        <TextField.Root name="game" className="w-full">
          <TextField.InputWrapper>
            <Magnifier className="size-32 text-icon-interactive-input-default" />
            <TextField.Input
              value={localQuery}
              onChange={handleChange}
              placeholder="오늘의 추천 게임은?"
            />
          </TextField.InputWrapper>
        </TextField.Root>
      }
      rightContent={
        <>
          {authStatus === "authenticated" ? (
            <>
              <PrimaryBoxButton size="sm" _style="solid" asChild>
                <Link href="/create">
                  <Add aria-hidden="true" />
                  게임 만들기
                </Link>
              </PrimaryBoxButton>
              <AvatarButton
                src={user?.profileImageUrl}
                onClick={handleLogout}
              />
            </>
          ) : (
            <KakaoLoginButton returnTo={returnTo} />
          )}
          <ThemeToggle />
        </>
      }
    />
  )
}
