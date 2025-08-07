import { fetchClient } from "@shared/lib/fetchClient"
import { ApiResponse } from "@shared/types/response"

import { GameListData } from "../model"
import { mapStatusToErrorResponse } from "../utils"

export const getDefaultGame = async (): Promise<ApiResponse<GameListData> | ApiResponse<null>> => {
  const response = await fetchClient.fetch("/games/default", {
    method: "GET",
  })

  if (!response.ok) {
    return mapStatusToErrorResponse(response.status)
  }

  return response.json()
}
