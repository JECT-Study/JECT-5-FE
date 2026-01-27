"use client"

import {
  Dialog,
  DialogBody,
  DialogButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@ject-5-fe/design/components/dialog"
import { useQueryClient } from "@tanstack/react-query"
import { isHTTPError } from "ky"
import { useRouter } from "next/navigation"
import { overlay } from "overlay-kit"
import { toast } from "sonner"

import type { GameListItem } from "@/entities/game"
import { deleteGame } from "@/entities/game/api"
import { cloneGame } from "@/entities/game/api/cloneGame"
import { useDashboardPopupActions } from "@/entities/game/model/useDashboardPopupActions"
import { useGameShareActions } from "@/entities/game/model/useGameShareActions"

export const useAdminGameActions = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { showShareConfirm, showUnshareConfirm, showDeleteConfirm } =
    useDashboardPopupActions()
  const { shareGame: shareGameAction, unshareGame: unshareGameAction } =
    useGameShareActions()

  const handleEditGame = (game: GameListItem) => {
    router.push(`/create?gameId=${game.gameId}`)
  }

  const handleShareGame = (game: GameListItem) => {
    if (game.isShared) {
      showUnshareConfirm(game, async () => {
        try {
          await unshareGameAction(game)
        } catch {
          toast.error("공유 해제에 실패했습니다.")
        }
      })
    } else {
      showShareConfirm(game, async () => {
        try {
          await shareGameAction(game)
        } catch {
          toast.error("공유에 실패했습니다.")
        }
      })
    }
  }

  const handleDeleteGame = (game: GameListItem) => {
    showDeleteConfirm(game, async () => {
      try {
        const response = await deleteGame(game.gameId)
        if (response.result === "SUCCESS") {
          queryClient.invalidateQueries({ queryKey: ["infiniteMyGames"] })
          toast.success("게임이 삭제되었습니다.")
        } else {
          toast.error("게임 삭제에 실패했습니다.")
        }
      } catch {
        toast.error("게임 삭제에 실패했습니다.")
      }
    })
  }

  const handleCopyLink = (game: GameListItem) => {
    const origin = window.location.origin
    navigator.clipboard
      .writeText(`${origin}/game/${game.gameId}`)
      .then(() => {
        toast("게임 링크를 클립보드에 복사하였습니다.")
      })
      .catch(() => {
        toast.error("링크 복사에 실패했습니다.")
      })
  }

  const handleCloneGame = async (game: GameListItem) => {
    const result = await overlay.openAsync(({ close, isOpen }) => {
      return (
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            if (!open) {
              close(false)
            }
          }}
        >
          <DialogContent>
            <DialogHeader>이 게임을 복제하시겠습니까?</DialogHeader>
            <DialogBody>
              선택한 게임이 복제되어, 곧바로 편집 화면으로 이동합니다.
            </DialogBody>
            <DialogFooter>
              <DialogButton.Secondary onClick={() => close(false)}>
                아니요
              </DialogButton.Secondary>
              <DialogButton.Primary onClick={() => close(true)}>
                네
              </DialogButton.Primary>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    })

    if (!result) {
      return
    }

    try {
      const clonedGame = await cloneGame(game.gameId)
      router.push(`/create?gameId=${clonedGame.data.gameId}`)
    } catch (error) {
      if (isHTTPError(error)) {
        if (error.response.status === 401) {
          toast.error("로그인이 필요합니다.")
          router.push("/login")
          return
        }
      }
      toast.error("게임 복제에 실패했습니다.")
    }
  }

  return {
    handleEditGame,
    handleShareGame,
    handleDeleteGame,
    handleCopyLink,
    handleCloneGame,
  }
}
