import { SecondaryPlainIconButton } from "@shared/design/src/components/button"
import { Cross } from "@shared/design/src/icons"
import { useRouter } from "next/navigation"

import { useGamePopupActions } from "../../model/useGamePopupActions"

export function RegisterButton() {
  const router = useRouter()
  const { showLibraryRegister } = useGamePopupActions()

  const handleRegister = () => {
    showLibraryRegister(() => {
      // 게임 생성 페이지에서 나가기
      router.push("/dashboard")
    })
  }

  return (
    <SecondaryPlainIconButton size="lg" onClick={handleRegister}>
      <Cross />
    </SecondaryPlainIconButton>
  )
}
