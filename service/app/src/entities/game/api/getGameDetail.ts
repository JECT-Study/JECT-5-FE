import { fetchClient } from "@shared/lib/fetchClient"
import { UUID } from "@shared/types/common"
import { ApiResponse } from "@shared/types/response"

import { GameDetailResponse } from "../model"
import { mapStatusToErrorResponse } from "../utils"

export const getGameDetail = async (
  gameId: UUID,
): Promise<GameDetailResponse | ApiResponse<null>> => {
  const response = await fetchClient.fetch(`/games/${gameId}`, {
    method: "GET",
  })

  if (!response.ok) {
    return mapStatusToErrorResponse(response.status, gameId)
  }

  return response.json()
}
