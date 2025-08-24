"use client"

import { SecondaryOutlineBoxButton } from "@shared/design/src/components/button"
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
  const [searchQuery, setSearchQuery] = useState("")
  const {
    user,
    isLoading: authLoading,
    isAuthenticated,
    login,
    logout,
  } = useAuth()
  const { setTheme, resolvedTheme } = useTheme()
  const [listButton, setListButton] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { games, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteGameList({
      limit: 19,
    })

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredGames = games.filter((game) => {
    if (!searchQuery.trim()) return true

    const query = searchQuery.toLowerCase().replace(/\s/g, "")
    const title = game.gameTitle.toLowerCase().replace(/\s/g, "")

    return title.includes(query)
  })

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
  }

  const handleLogin = async () => {
    if (process.env.NODE_ENV === "development") {
      try {
        await login("someValidCode")
      } catch (error) {
        console.error("Login error:", error)
      }
      return
    }

    window.location.href = "/login"
  }

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const handleLogoClick = () => {
    router.push("/")
  }

  const handleAvatarClick = () => {
    setListButton(!listButton)
  }

  const handleLogoutClick = () => {
    logout()
    setListButton(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (listButton && !target.closest("[data-user-menu]")) {
        setListButton(false)
      }
    }

    if (listButton) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [listButton])

  const leftContent = (
    <button
      className="flex h-[60px] w-[268px] cursor-pointer items-center justify-center p-3.5 focus:outline-none"
      onClick={handleLogoClick}
      aria-label="홈으로 이동"
      tabIndex={0}
    >
      <Image
        src="/logo.svg"
        alt="홈 로고"
        className="size-full"
        width={268}
        height={60}
      />
    </button>
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
            <span className="text-sm font-medium text-text-primary">
              {user?.nickname}
            </span>
          </div>
          <div className="relative" data-user-menu>
            <button
              className="flex size-[42px] cursor-pointer items-center justify-center rounded-full bg-gray-300 focus:outline-none"
              onClick={handleAvatarClick}
              aria-label={`사용자 메뉴 ${listButton ? "닫기" : "열기"}`}
              aria-expanded={listButton}
              aria-haspopup="true"
              tabIndex={0}
            >
              <Image
                src="/avatar.svg"
                alt="사용자 아바타"
                className="size-full rounded-full"
                width={42}
                height={42}
              />
            </button>
            {listButton && (
              <div
                className="absolute right-0 top-full z-10 mt-2"
                role="menu"
                aria-label="사용자 메뉴"
              >
                <SecondaryOutlineBoxButton
                  size="md"
                  onClick={handleLogoutClick}
                  className="whitespace-nowrap"
                  role="menuitem"
                  aria-label="로그아웃"
                  tabIndex={0}
                >
                  로그아웃
                </SecondaryOutlineBoxButton>
              </div>
            )}
          </div>
        </>
      ) : (
        <SecondaryOutlineBoxButton
          size="md"
          onClick={handleLogin}
          disabled={authLoading}
          aria-label={authLoading ? "로그인 처리 중" : "카카오 간편 로그인"}
          aria-busy={authLoading}
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
          games={filteredGames}
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
