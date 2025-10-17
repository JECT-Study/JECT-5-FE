"use client"

//링크 복사 -> 게임 링크를 클립보드에 복사 -> toast띄우기
//복제 -> dialog띄우기 -> cloneGame -> 복제한게임을 /create로 이동

import {
  Dialog,
  DialogBody,
  DialogButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@ject-5-fe/design/components/dialog"
import { isHTTPError } from "ky"
import { useRouter } from "next/navigation"
import { overlay } from "overlay-kit"
import { toast } from "sonner"

import { cloneGame } from "@/entities/game/api/cloneGame"

export const useActions = () => {
  const router = useRouter()
  const copy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link)
      toast("게임 링크를 클립보드에 복사하였습니다.")
    } catch (e) {
      toast("링크 복사에 실패했습니다")
    }
  }
  const clone = async (gameId: string) => {
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
    if (result) {
      try {
        const clonedGame = await cloneGame(gameId)
        router.push(`/create?gameId=${clonedGame.data.gameId}`)
      } catch (e) {
        if (isHTTPError(e)) {
          switch (e.response.status) {
            case 401:
              toast.error("로그인이 필요합니다")
              router.push("/login")
              return
            case 404:
              toast.error("존재하지 않는 게임입니다")
              return
          }
        } else {
          toast.error("에러가 발생했습니다")
        }
      }
    }
  }
  return { copy, clone }
}
