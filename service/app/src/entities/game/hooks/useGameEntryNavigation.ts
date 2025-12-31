import { useRouter } from "next/navigation"

import { ENTRY_KEYS } from "@/shared/lib/saveEntry"
import { getEntry, saveEntry } from "@/shared/lib/saveEntry"

export const useGameEntryNavigation = () => {
  const router = useRouter()

  const startGame = (gameId: string) => {
    saveEntry(ENTRY_KEYS.game)
    router.push(`/game/${gameId}/setup`)
  }

  const goBackToEntry = () => {
    const entry = getEntry(ENTRY_KEYS.game)
    router.push(entry ?? "/")
  }

  return { startGame, goBackToEntry }
}
