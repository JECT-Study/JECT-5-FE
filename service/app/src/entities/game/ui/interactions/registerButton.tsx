import { SecondaryPlainIconButton } from "@shared/design/src/components/button"
import { Cross } from "@shared/design/src/icons"

import { usePopup } from "../popupManager"

export function RegisterButton() {
  const { showPopup } = usePopup()

  const handleRegister = () => {
    showPopup("libraryRegister")
  }

  return (
    <SecondaryPlainIconButton size="lg" onClick={handleRegister}>
      <Cross />
    </SecondaryPlainIconButton>
  )
}
