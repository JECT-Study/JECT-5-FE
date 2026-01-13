"use client"

import {
  Dialog,
  DialogBody,
  DialogButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@ject-5-fe/design/components/dialog"
import { overlay } from "overlay-kit"

function CloneGameDialogContent({
  close,
  isOpen,
}: {
  close: (result: boolean) => void
  isOpen: boolean
}) {
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
}

export function openCloneGameDialog() {
  return overlay.openAsync<boolean>(({ isOpen, close }) => (
    <CloneGameDialogContent isOpen={isOpen} close={close} />
  ))
}
