import { CustomDialog } from "@shared/design/src/components/dialog"

interface LibraryRegisterPopupProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function LibraryRegisterPopup({ open, onClose, onConfirm }: LibraryRegisterPopupProps) {
  return (
    <CustomDialog
      open={open}
      onOpenChange={onClose}
      variant="title"
      title="이 게임을 라이브러리에 등록하시겠습니까?"
      description="등록된 게임은 모든 사용자와 공유되며, 등록 후에는 수정이 불가능합니다."
      onConfirm={onConfirm}
      onCancel={onClose}
      confirmText="네"
      cancelText="아니요"
    />
  )
} 