"use client"

import {
  PrimaryBoxButton,
  SecondaryGhostIconButton,
  SecondaryOutlineBoxButton,
} from "@shared/design/src/components/button"
import { Navigation } from "@shared/design/src/components/navigation"
import { Add, Sun } from "@shared/design/src/icons"
import { useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { overlay } from "overlay-kit"
import { useEffect, useState } from "react"

import { useAuth } from "@/entities/auth"
import { GameListItem } from "@/entities/game"
import {
  deleteGame,
  getGameDetail,
  shareGame,
  unshareGame,
} from "@/entities/game/api"
import { useDashboardPopupActions } from "@/entities/game/model/useDashboardPopupActions"
import { useInfiniteMyGames } from "@/entities/game/model/useInfiniteMyGames"
import { GameLibraryGrid } from "@/entities/game/ui/components"
import { GamePreview } from "@/entities/game/ui/components/gamePreview"

export default function DashboardPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [_searchQuery, _setSearchQuery] = useState("")
  const { user, isLoading: _authLoading, isAuthenticated, logout } = useAuth()
  const [listButton, setListButton] = useState(false)

  const {
    games,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteMyGames({
    limit: 19,
  })

  const { showShareConfirm, showUnshareConfirm, showDeleteConfirm } =
    useDashboardPopupActions()

  useEffect(() => {
    refetch()
  }, [refetch])

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
    router.push(`/create?gameId=${game.gameId}`)
  }

  const handleShareGame = (game: GameListItem) => {
    if (game.isShared) {
      showUnshareConfirm(game, async () => {
        try {
          const response = await unshareGame(game.gameId)
          if (response.result === "SUCCESS") {
            console.log("Game unshared successfully")
            queryClient.invalidateQueries({ queryKey: ["infiniteMyGames"] })
          } else {
            console.error("Failed to unshare game")
          }
        } catch (error) {
          console.error("Error unsharing game:", error)
        }
      })
    } else {
      showShareConfirm(game, async () => {
        try {
          const response = await shareGame(game.gameId)
          if (response.result === "SUCCESS") {
            console.log("Game shared successfully")
            queryClient.invalidateQueries({ queryKey: ["infiniteMyGames"] })
          } else {
            console.error("Failed to share game")
          }
        } catch (error) {
          console.error("Error sharing game:", error)
        }
      })
    }
  }

  const handleDeleteGame = (game: GameListItem) => {
    showDeleteConfirm(game, async () => {
      try {
        const response = await deleteGame(game.gameId)
        if (response.result === "SUCCESS") {
          console.log("Game deleted successfully")
          queryClient.invalidateQueries({ queryKey: ["infiniteMyGames"] })
        } else {
          console.error("Failed to delete game")
        }
      } catch (error) {
        console.error("Error deleting game:", error)
      }
    })
  }

  const handleThemeToggle = () => {}

  const handleLogoClick = () => {
    router.push("/")
  }

  const handleAvatarClick = () => {
    setListButton(!listButton)
  }

  const handleLogoutClick = () => {
    logout()
    setListButton(false)
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
      <PrimaryBoxButton size="sm" _style="solid" onClick={handleCreateGame}>
        <Add />
        게임 만들기
      </PrimaryBoxButton>

      {isAuthenticated ? (
        <div className="relative">
          <div
            className="flex size-[42px] cursor-pointer items-center justify-center rounded-full bg-gray-300"
            onClick={handleAvatarClick}
          >
            <Image
              src={user?.profileImageUrl || "/avatar.svg"}
              alt="사용자 아바타"
              className="size-full rounded-full"
              width={42}
              height={42}
            />
          </div>
          {listButton && (
            <div className="absolute right-0 top-full z-10 mt-2">
              <SecondaryOutlineBoxButton
                size="md"
                onClick={handleLogoutClick}
                className="whitespace-nowrap"
              >
                로그아웃
              </SecondaryOutlineBoxButton>
            </div>
          )}
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
