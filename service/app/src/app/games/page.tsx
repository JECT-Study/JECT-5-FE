"use client"

import {
  SecondaryOutlineBoxButton,
} from "@shared/design/src/components/button"
import { Navigation } from "@shared/design/src/components/navigation"
import { ThemeToggle } from "@shared/design/src/components/themeToggle"
import { Magnifier } from "@shared/design/src/icons"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { overlay } from "overlay-kit"
import { useEffect, useState } from "react"

import { useAuth } from "@/entities/auth"
import { GameListItem } from "@/entities/game"
import { getGameDetail } from "@/entities/game/api/getGameDetail"
import { useInfiniteGameList } from "@/entities/game/model/useInfiniteGameList"
import { GameLibraryGrid } from "@/entities/game/ui/components"
import { GamePreview } from "@/entities/game/ui/components/gamePreview"

export default function GamesPage() {
  const router = useRouter()
  const [_searchQuery, setSearchQuery] = useState("")
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const { games, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteGameList({
      limit: 19,
    })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCreateGame = () => {
    router.push("/create")
  }

  const handleGameClick = async (game: GameListItem) => {
    try {
      const gameDetailRes = await getGameDetail(game.gameId)

      if (gameDetailRes.result === "SUCCESS" && gameDetailRes.data) {
        const gameDetail = gameDetailRes.data

        overlay.open(({ close, isOpen }) => {
          const handleStartGame = () => {
            close()
            router.push(`/game/${game.gameId}`)
          }

          return (
            <GamePreview
              gameTitle={gameDetail.gameTitle}
              creatorName={gameDetail.nickname}
              questionCount={gameDetail.questionCount}
              questions={gameDetail.questions.map((question) => ({
                id: question.questionId.toString(),
                title: question.questionText,
                imageUrl: question.imageUrl,
              }))}
              onClose={close}
              onStartGame={handleStartGame}
              isOpen={isOpen}
            />
          )
        })
      } else {
        console.error("Failed to fetch game detail")
      }
    } catch (error) {
      console.error("Error fetching game detail:", error)
    }
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    console.log("Search query:", e.target.value)
  }

  const handleLogin = async () => {
    console.log("Login clicked")
    router.push("/login")
  }

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogoClick = () => {
    router.push("/")
  }

  const leftContent = (
    <div
      className="flex h-[60px] w-[268px] cursor-pointer items-center justify-center p-3.5"
      onClick={handleLogoClick}
    >
      <Image
        src="/logo.svg"
        alt="홈 로고"
        className="size-full"
        width={268}
        height={60}
      />
    </div>
  )

  const centerContent = (
    <div className="flex size-full items-center gap-2 rounded-[5px] border border-border-interactive-input-default bg-background-interactive-input-primary px-5 focus-within:border-2 focus-within:border-border-interactive-input-focused">
      <Magnifier className="size-4 text-icon-interactive-input-default" />
      <input
        type="text"
        placeholder="오늘의 추천 게임은?"
        onChange={handleSearchChange}
        className="flex-1 bg-transparent text-[19px] font-medium leading-[120%] text-text-interactive-input-filled placeholder:text-text-interactive-input-placeholder focus:outline-none"
      />
    </div>
  )

  const rightContent = (
    <>
      {isAuthenticated ? (
        <>
          <div className="flex items-center gap-2">
            <div className="flex size-[42px] items-center justify-center rounded-full bg-gray-300">
              <Image
                src={user?.profileImageUrl || "/avatar.svg"}
                alt="사용자 아바타"
                className="size-full rounded-full"
                width={42}
                height={42}
              />
            </div>
            <span className="text-sm font-medium text-text-primary">
              {user?.nickname}
            </span>
          </div>
          <SecondaryOutlineBoxButton size="md" onClick={logout}>
            로그아웃
          </SecondaryOutlineBoxButton>
        </>
      ) : (
        <SecondaryOutlineBoxButton
          size="md"
          onClick={handleLogin}
          disabled={authLoading}
        >
          <Image
            src="/kakao-logo.svg"
            alt="카카오 로고"
            className="size-8"
            width={32}
            height={32}
          />
          간편로그인해서 게임 만들기
        </SecondaryOutlineBoxButton>
      )}

      {mounted && (
        <ThemeToggle
          theme={(resolvedTheme as "dark" | "light") || "light"}
          onThemeToggle={handleThemeToggle}
        />
      )}
    </>
  )

  return (
    <main className="min-h-screen bg-background-primary">
      <Navigation
        type="searchbar"
        playGame={false}
        leftContent={leftContent}
        centerContent={centerContent}
        rightContent={rightContent}
      />
      <div className="flex w-full flex-col items-center gap-[45px] pt-[40px]">
        <GameLibraryGrid
          games={games}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onCreateGame={handleCreateGame}
          onGameClick={handleGameClick}
          onLoadMore={handleLoadMore}
        />
      </div>
    </main>
  )
}
