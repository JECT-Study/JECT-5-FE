import { fetchClient } from "@/shared/api/fetchClient"
import type { UUID } from "@/shared/api/types/common"

export const cloneGame = async (gameId: UUID) => {
  const response = await fetchClient.post<null>(`games/${gameId}`)
  return response.json()
}
