import { CustomDialog } from "@shared/design/src/components/dialog"

interface SaveConfirmPopupProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function SaveConfirmPopup({ open, onClose, onConfirm }: SaveConfirmPopupProps) {
  return (
    <CustomDialog
      open={open}
      onOpenChange={onClose}
      variant="onlyTitle"
      title="게임을 저장하시겠습니까?"
      onConfirm={onConfirm}
      onCancel={onClose}
      confirmText="네"
      cancelText="아니요"
    />
  )
} 