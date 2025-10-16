import { fetchClient } from "@/shared/api/fetchClient"
import { UUID } from "@/shared/api/types/common"

export const playGame = async (gameId: UUID) => {
  const response = await fetchClient.post(`games/${gameId}/plays`, {
    method: "POST",
  })

  return response.json()
}
