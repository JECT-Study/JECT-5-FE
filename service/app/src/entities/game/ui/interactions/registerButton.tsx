import { SecondaryPlainIconButton } from "@shared/design/src/components/button"
import { Cross } from "@shared/design/src/icons"
import { useRouter } from "next/navigation"

import { useGameCreationContext } from "../../model/state/create/gameCreationContext"
import { useGamePopupActions } from "../../model/useGamePopupActions"

export function RegisterButton() {
  const router = useRouter()
  const { showLibraryRegister } = useGamePopupActions()
  const { actions } = useGameCreationContext()

  const handleRegister = () => {
    showLibraryRegister(() => {
      actions.clearDraft()
      router.push("/dashboard")
    })
  }

  return (
    <SecondaryPlainIconButton 
      size="lg" 
      onClick={handleRegister}
      aria-label="게임 생성 취소"
      data-testid="close-button"
    >
      <Cross />
    </SecondaryPlainIconButton>
  )
}
