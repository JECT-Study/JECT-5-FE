import { SecondaryPlainIconButton } from "@shared/design/src/components/button"
import { Cross } from "@shared/design/src/icons"

import { useGamePopupActions } from "../../model/useGamePopupActions"

export function RegisterButton() {
  const { showLibraryRegister } = useGamePopupActions()

  const handleRegister = () => {
    showLibraryRegister()
  }

  return (
    <SecondaryPlainIconButton size="lg" onClick={handleRegister}>
      <Cross />
    </SecondaryPlainIconButton>
  )
}
