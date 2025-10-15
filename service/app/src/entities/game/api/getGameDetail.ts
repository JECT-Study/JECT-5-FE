import { fetchClient } from "@/shared/api/fetchClient"
import { UUID } from "@/shared/api/types/common"

import { GameDetailData } from "../model"

export const getGameDetail = async (
  gameId: UUID,
  options: RequestInit = {},
) => {
  const response = await fetchClient.get<GameDetailData>(`games/${gameId}`, {
    ...options,
  })
  return response.json()
}
