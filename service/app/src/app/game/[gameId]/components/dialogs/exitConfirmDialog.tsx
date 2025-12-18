"use client"

import {
  Dialog,
  DialogBody,
  DialogButton,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@ject-5-fe/design/components/dialog"
import { overlay } from "overlay-kit"

export interface ExitConfirmOptions {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export function openExitConfirmDialog({
  title = "이 게임을 종료하시겠습니까?",
  description = "설정한 내용은 저장되지 않습니다. 나가시겠습니까?",
  confirmText = "네",
  cancelText = "아니요",
  onConfirm,
  onCancel,
}: ExitConfirmOptions = {}) {
  overlay.open(({ isOpen, close }) => (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>{title}</DialogHeader>
        <DialogBody>{description}</DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <DialogButton.Secondary
              onClick={() => {
                onCancel?.()
              }}
            >
              {cancelText}
            </DialogButton.Secondary>
          </DialogClose>
          <DialogClose asChild>
            <DialogButton.Destructive
              onClick={() => {
                onConfirm?.()
              }}
            >
              {confirmText}
            </DialogButton.Destructive>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ))
}
