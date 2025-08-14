import { PrimaryBoxButton } from "@shared/design/src/components/button"

import { validateQuestion } from "../../model"
import { useGameCreationContext } from "../../model/state/create/gameCreationContext"
import { selectors } from "../../model/state/create/selectors"
import { useGamePopupActions } from "../../model/useGamePopupActions"
import { saveGame } from "../../utils/gameSave"

export function SaveButton() {
  const { state, actions } = useGameCreationContext()
  const { showSaveConfirm, showValidationError, showSaveError } = useGamePopupActions()

  const handleSave = () => {
    const hasValidationError = state.questions.some(
      (question) => !validateQuestion(question),
    )

    if (hasValidationError) {
      showValidationError()
      return
    }

    showSaveConfirm(async () => {
      try {
        actions.saveGameStart()

        const cleanedQuestions = selectors.cleanedQuestions(state)

        const result = await saveGame({
          ...state,
          questions: cleanedQuestions,
        })

        if (result.success) {
          actions.saveGameSuccess()
        } else {
          actions.saveGameError(
            result.error || "저장에 실패했습니다.",
          )
          showSaveError()
        }
      } catch (error) {
        actions.saveGameError("알 수 없는 오류가 발생했습니다.")
        showSaveError()
      }
    })
  }

  return (
    <PrimaryBoxButton size="sm" _style="solid" onClick={handleSave}>
      게임 저장
    </PrimaryBoxButton>
  )
}
