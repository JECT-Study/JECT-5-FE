"use client"

import {
  SecondaryGhostIconButton,
  SecondaryOutlineBoxButton,
} from "@shared/design/src/components/button"
import { Navigation } from "@shared/design/src/components/navigation"
import { Magnifier, Sun } from "@shared/design/src/icons"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { GameListItem } from "@/entities/game"
import { useInfiniteGameList } from "@/entities/game/model/useInfiniteGameList"
import { GameLibraryGrid } from "@/entities/game/ui/components"

export default function GamesPage() {
  const router = useRouter()
  const [_searchQuery, setSearchQuery] = useState("")

  const { games, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteGameList({
      limit: 19,
    })

  const handleCreateGame = () => {
    router.push("/create")
  }

  const handleGameClick = (game: GameListItem) => {
    router.push(`/game/${game.gameId}`)
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // TODO: Implement search functionality
    console.log("Search query:", e.target.value)
  }

  const handleLogin = () => {
    // TODO: Implement login functionality
    console.log("Login clicked")
  }

  const handleThemeToggle = () => {}

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
        className="flex-1 text-[19px] font-medium leading-[120%] text-text-primary placeholder:text-text-interactive-input-placeholder focus:outline-none"
      />
    </div>
  )

  const rightContent = (
    <>
      <SecondaryOutlineBoxButton size="md" onClick={handleLogin}>
        <Image
          src="/kakao-logo.png"
          alt="카카오 로고"
          className="size-8"
          width={32}
          height={32}
        />
        간편로그인해서 게임 만들기
      </SecondaryOutlineBoxButton>

      <SecondaryGhostIconButton onClick={handleThemeToggle}>
        <Sun />
      </SecondaryGhostIconButton>
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
