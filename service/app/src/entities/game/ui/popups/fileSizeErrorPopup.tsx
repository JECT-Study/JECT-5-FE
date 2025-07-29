import { CustomDialog } from "@shared/design/src/components/dialog"

interface FileSizeErrorPopupProps {
  open: boolean
  onClose: () => void
}

export function FileSizeErrorPopup({ open, onClose }: FileSizeErrorPopupProps) {
  return (
    <CustomDialog
      open={open}
      onOpenChange={onClose}
      variant="onlyBody"
      description="최대 2MB 이하 이미지만 업로드 가능합니다."
      onCancel={onClose}
      cancelText="닫기"
    />
  )
} 