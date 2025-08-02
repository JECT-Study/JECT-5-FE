import { fetchClient } from "@shared/lib/fetchClient"
import { ApiResponse } from "@shared/types/response"

import { GameCreateRequest } from "../model"
import { mapStatusToErrorResponse } from "../utils"

export const createGame = async (
  gameData: GameCreateRequest,
): Promise<ApiResponse<null>> => {
  const response = await fetchClient.fetch("/games", {
    method: "POST",
    body: JSON.stringify(gameData),
  })

  if (!response.ok) {
    return mapStatusToErrorResponse(response.status)
  }

  return response.json()
}
