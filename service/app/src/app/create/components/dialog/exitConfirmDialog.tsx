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

interface ExitConfirmOptions {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export function openExitConfirmDialog({
  title = "게임을 저장하지 않았습니다. 정말 나가시겠습니까?",
  description = "저장하지 않으면 모든 변경사항이 사라집니다.",
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
                close()
              }}
            >
              {cancelText}
            </DialogButton.Secondary>
          </DialogClose>
          <DialogClose asChild>
            <DialogButton.Destructive
              onClick={() => {
                onConfirm?.()
                close()
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
