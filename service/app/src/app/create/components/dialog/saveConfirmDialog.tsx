import {
  Dialog,
  DialogButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@shared/design/src/components/dialog"
import { overlay } from "overlay-kit"

interface SaveConfirmOptions {
  title?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export function openSaveConfirmDialog({
  title = "게임을 저장하시겠습니까?",
  confirmText = "네",
  cancelText = "아니요",
  onConfirm,
  onCancel,
}: SaveConfirmOptions = {}) {
  overlay.open(({ isOpen, close }) => (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>{title}</DialogHeader>
        <DialogFooter>
          <DialogButton.Secondary
            onClick={() => {
              onCancel?.()
              close()
            }}
          >
            {cancelText}
          </DialogButton.Secondary>
          <DialogButton.Primary
            onClick={() => {
              onConfirm?.()
              close()
            }}
          >
            {confirmText}
          </DialogButton.Primary>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ))
}
