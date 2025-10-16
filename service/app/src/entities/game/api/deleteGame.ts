import { fetchClient } from "@/shared/api/fetchClient"
import { UUID } from "@/shared/api/types/common"

export const deleteGame = async (gameId: UUID) => {
  const response = await fetchClient.delete<null>(`games/${gameId}`, {})

  return response.json()
}
