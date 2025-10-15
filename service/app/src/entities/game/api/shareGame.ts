import { fetchClient } from "@/shared/api/fetchClient"
import { UUID } from "@/shared/api/types/common"

export const shareGame = async (gameId: UUID) => {
  const response = await fetchClient.post(`games/${gameId}/share`, {
    method: "POST",
  })

  return response.json()
}

export const unshareGame = async (gameId: UUID) => {
  const response = await fetchClient.post(`games/${gameId}/unshare`, {
    method: "POST",
  })
  return response.json()
}
