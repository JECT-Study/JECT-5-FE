import { CustomDialog } from "@shared/design/src/components/dialog"

interface FileTypeErrorPopupProps {
  open: boolean
  onClose: () => void
}

export function FileTypeErrorPopup({ open, onClose }: FileTypeErrorPopupProps) {
  return (
    <CustomDialog
      open={open}
      onOpenChange={onClose}
      variant="onlyBody"
      description="JPG, JPEG, PNG 형식의 파일만 업로드 가능합니다."
      onCancel={onClose}
      cancelText="닫기"
    />
  )
} 