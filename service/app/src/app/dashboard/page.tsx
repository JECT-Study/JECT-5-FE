"use client"

import {
  PrimaryBoxButton,
  SecondaryGhostIconButton,
} from "@shared/design/src/components/button"
import { Navigation } from "@shared/design/src/components/navigation"
import { Add, Sun } from "@shared/design/src/icons"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { overlay } from "overlay-kit"
import { useState } from "react"

import { useAuth } from "@/entities/auth"
import { GameListItem } from "@/entities/game"
import { getGameDetail } from "@/entities/game/api/getGameDetail"
import { useInfiniteGameList } from "@/entities/game/model/useInfiniteGameList"
import { GameLibraryGrid } from "@/entities/game/ui/components"
import { GamePreview } from "@/entities/game/ui/components/gamePreview"

export default function DashboardPage() {
  const router = useRouter()
  const [_searchQuery, _setSearchQuery] = useState("")
  const {
    user,
    isLoading: _authLoading,
    isAuthenticated,
  } = useAuth()

  const { games, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteGameList({
      limit: 19,
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

  const handleEditGame = (game: GameListItem) => {
    console.log("Edit game:", game.gameId)
    // TODO: 게임 수정 페이지로 이동
    router.push(`/create?gameId=${game.gameId}`)
  }

  const handleShareGame = (game: GameListItem) => {
    console.log("Share game:", game.gameId)
    // TODO: 게임 공유 기능 구현
  }

  const handleDeleteGame = (game: GameListItem) => {
    console.log("Delete game:", game.gameId)
    // TODO: 게임 삭제 확인 다이얼로그 표시
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
    <h1 className="typography-heading-xl-semibold text-text-primary">
      내 게임
    </h1>
  )

  const rightContent = (
    <>
      <PrimaryBoxButton
        size="sm"
        _style="solid"
        onClick={handleCreateGame}
      >
        <Add />
        게임 만들기
      </PrimaryBoxButton>

      {isAuthenticated ? (
        <div className="flex size-[42px] items-center justify-center rounded-full bg-gray-300">
          <Image
            src={user?.profileImageUrl || "/avatar.svg"}
            alt="사용자 아바타"
            className="size-full rounded-full"
            width={42}
            height={42}
          />
        </div>
      ) : (
        <div className="flex size-[42px] items-center justify-center rounded-full bg-gray-300">
          <Image
            src="/avatar.svg"
            alt="기본 아바타"
            className="size-full rounded-full"
            width={42}
            height={42}
          />
        </div>
      )}

      <SecondaryGhostIconButton onClick={handleThemeToggle}>
        <Sun />
      </SecondaryGhostIconButton>
    </>
  )

  return (
    <main className="min-h-screen bg-background-primary">
      <Navigation
        type="title"
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
          isDashboard={true}
          onEditGame={handleEditGame}
          onShareGame={handleShareGame}
          onDeleteGame={handleDeleteGame}
        />
      </div>
    </main>
  )
}
