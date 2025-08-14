import { PrimaryBoxButton } from "@shared/design/src/components/button"
import { useRouter } from "next/navigation"

import { validateQuestion } from "../../model"
import { useGameCreationContext } from "../../model/state/create/gameCreationContext"
import { selectors } from "../../model/state/create/selectors"
import { useGamePopupActions } from "../../model/useGamePopupActions"
import { saveGame } from "../../utils/gameSave"

export function SaveButton() {
  const { state, actions } = useGameCreationContext()
  const { showSaveConfirm, showValidationError, showSaveError } = useGamePopupActions()
  const router = useRouter()

  const handleSave = () => {
    const gameNameError = selectors.gameNameError(state)
    if (gameNameError) {
      showValidationError()
      return
    }

    const hasValidationError = state.questions.some(
      (question) => !validateQuestion(question),
    )

    if (hasValidationError) {
      showValidationError()
      return
    }

    if (state.questions.length === 0) {
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
          router.push(`/dashboard`)
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
    <PrimaryBoxButton 
      size="sm" 
      _style="solid" 
      onClick={handleSave}
      disabled={!selectors.canSave(state)}
    >
      게임 저장
    </PrimaryBoxButton>
  )
}
