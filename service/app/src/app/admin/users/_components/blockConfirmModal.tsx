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

interface BlockConfirmModalOptions {
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
}

export function openBlockConfirmModal({
  onConfirm,
  onCancel,
  confirmText = "예",
  cancelText = "아니요",
}: BlockConfirmModalOptions = {}) {
  overlay.open(({ isOpen, close }) => (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>선택한 사용자를{"\n"}차단하시겠습니까?</DialogHeader>
        <DialogBody>
          차단 처리 시 해당 계정은 게임 생성 및 공유, 신고 기능에 대한 접근
          권한을 즉시 상실합니다.
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
