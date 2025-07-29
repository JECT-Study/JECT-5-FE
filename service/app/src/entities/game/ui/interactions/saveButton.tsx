import { PrimaryBoxButton } from "@shared/design/src/components/button"

import { usePopup } from "../popupManager"

export function SaveButton() {
  const { showPopup } = usePopup()
  
  const handleSave = () => {
    showPopup("saveConfirm")
  }
  
  return (
    <PrimaryBoxButton size="sm" _style="solid" onClick={handleSave}>
      게임 저장
    </PrimaryBoxButton>
  )
} 