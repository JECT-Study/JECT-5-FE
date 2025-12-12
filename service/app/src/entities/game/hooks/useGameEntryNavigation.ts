import { useRouter } from "next/navigation"

import { getEntry, saveEntry } from "@/shared/lib/saveEntry"

export const useGameEntryNavigation = () => {
  const router = useRouter()

  const startGame = (gameId: string) => {
    saveEntry()
    router.push(`/game/${gameId}/play`)
  }

  const goBackToEntry = () => {
    const entry = getEntry()
    router.push(entry ?? "/")
  }

  return { startGame, goBackToEntry }
}
