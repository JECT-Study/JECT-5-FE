"use client"

import {
  Dialog,
  DialogBody,
  DialogButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@shared/design/src/components/dialog"
import { overlay } from "overlay-kit"

import type { GameListItem } from "../model"

export function useDashboardPopupActions() {
  const showShareConfirm = (game: GameListItem, onConfirm: () => void) => {
    overlay.open(({ isOpen, close }) => {
      return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
          <DialogContent>
            <DialogHeader>
              이 게임을 라이브러리에 등록하시겠습니까?
            </DialogHeader>
            <DialogBody>
              등록된 게임은 모든 사용자와 공유되며, 등록 후에는 수정이
              불가능합니다.
            </DialogBody>
            <DialogFooter variant="title">
              <DialogButton.Secondary onClick={() => close()}>
                아니요
              </DialogButton.Secondary>
              <DialogButton.Primary
                onClick={() => {
                  onConfirm()
                  close()
                }}
              >
                네
              </DialogButton.Primary>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    })
  }

  const showUnshareConfirm = (game: GameListItem, onConfirm: () => void) => {
    overlay.open(({ isOpen, close }) => {
      return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
          <DialogContent>
            <DialogHeader>라이브러리 공유를 취소하시겠습니까?</DialogHeader>
            <DialogBody>
              이 게임은 더 이상 다른 사용자에게 표시되지 않습니다.
            </DialogBody>
            <DialogFooter variant="title">
              <DialogButton.Secondary onClick={() => close()}>
                아니요
              </DialogButton.Secondary>
              <DialogButton.Destructive
                onClick={() => {
                  onConfirm()
                  close()
                }}
              >
                네
              </DialogButton.Destructive>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    })
  }

  const showDeleteConfirm = (game: GameListItem, onConfirm: () => void) => {
    overlay.open(({ isOpen, close }) => {
      return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
          <DialogContent>
            <DialogHeader>게임을 삭제하시겠습니까?</DialogHeader>
            <DialogBody>삭제된 게임은 복구할 수 없습니다.</DialogBody>
            <DialogFooter variant="title">
              <DialogButton.Secondary onClick={() => close()}>
                아니요
              </DialogButton.Secondary>
              <DialogButton.Destructive
                onClick={() => {
                  onConfirm()
                  close()
                }}
              >
                네
              </DialogButton.Destructive>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    })
  }

  return {
    showShareConfirm,
    showUnshareConfirm,
    showDeleteConfirm,
  }
}
