import { PrimaryBoxButton } from "@shared/design/src/components/button"

import { validateQuestion } from "../../model"
import { useGameCreationContext } from "../../model/state/create/gameCreationContext"
import { useGamePopupActions } from "../../model/useGamePopupActions"

export function SaveButton() {
  const { state } = useGameCreationContext()
  const { showSaveConfirm, showValidationError } = useGamePopupActions()

  const handleSave = () => {
    const hasValidationError = state.questions.some(
      (question) => !validateQuestion(question),
    )

    if (hasValidationError) {
      showValidationError()
      return
    }

    showSaveConfirm()
  }

  return (
    <PrimaryBoxButton size="sm" _style="solid" onClick={handleSave}>
      게임 저장
    </PrimaryBoxButton>
  )
}
