"use client"

import * as TextField from "@ject-5-fe/design/components/textField"
import { Navigation } from "@shared/design/src/components/navigation"
import { ThemeToggle } from "@shared/design/src/components/themeToggle"
import { Magnifier } from "@shared/design/src/icons"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { overlay } from "overlay-kit"
import { useState } from "react"

import { useAuthStore } from "@/entities/auth"
import { GameListItem } from "@/entities/game"
import { getGameDetail } from "@/entities/game/api/getGameDetail"
import { useInfiniteGameList } from "@/entities/game/model/useInfiniteGameList"
import { GameLibraryGrid } from "@/entities/game/ui/components"
import { GamePreview } from "@/entities/game/ui/components/gamePreview"
import AvatarButton from "@/widgets/components/avatarButton"
import { KakaoLoginButton } from "@/widgets/components/kakaoLoginButton"

export default function GamesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { logout, isAuthenticated, user } = useAuthStore()

  const { games, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteGameList({
      limit: 19,
    })

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

  const handleKakaoLogin = () => {
    router.push("/login")
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleLogoutClick = () => {
    logout()
  }

  const leftContent = (
    <Link href="/" aria-label="홈으로 이동">
      <Image src="/logo.svg" alt="홈 로고" width={268} height={60} />
    </Link>
  )

  const centerContent = (
    <div className="hidden w-full max-w-[871px] md:flex">
      <TextField.Root name="game" className="w-full">
        <TextField.InputWrapper>
          <Magnifier className="size-32 text-icon-interactive-input-default" />
          <TextField.Input
            onChange={handleSearchChange}
            placeholder="오늘의 추천 게임은?"
          ></TextField.Input>
        </TextField.InputWrapper>
      </TextField.Root>
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
          <AvatarButton onClick={handleLogoutClick} />
        </>
      ) : (
        <KakaoLoginButton onClick={handleKakaoLogin} />
      )}
      <ThemeToggle />
    </>
  )

  return (
    <main className="min-h-screen bg-background-primary">
      <Navigation
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
