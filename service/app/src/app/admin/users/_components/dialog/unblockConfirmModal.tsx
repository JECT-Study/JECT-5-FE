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

interface UnblockConfirmModalOptions {
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
}

export function openUnblockConfirmModal({
  onConfirm,
  onCancel,
  confirmText = "예",
  cancelText = "아니요",
}: UnblockConfirmModalOptions = {}) {
  overlay.open(({ isOpen, close }) => (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>선택한 사용자를{"\n"}차단 해제하시겠습니까?</DialogHeader>
        <DialogBody>
          차단 해제 즉시 사용자의 모든 이용 제한이 해제됩니다.
        </DialogBody>
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
          <DialogButton.Destructive
            onClick={() => {
              onConfirm?.()
              close()
            }}
          >
            {confirmText}
          </DialogButton.Destructive>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ))
}
