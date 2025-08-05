import { PrimaryBoxButton } from "@shared/design/src/components/button"

import { useGamePopupActions } from "../../model/useGamePopupActions"

export function SaveButton() {
  const { showSaveConfirm } = useGamePopupActions()

  const handleSave = () => {
    showSaveConfirm()
  }

  return (
    <PrimaryBoxButton size="sm" _style="solid" onClick={handleSave}>
      게임 저장
    </PrimaryBoxButton>
  )
}
