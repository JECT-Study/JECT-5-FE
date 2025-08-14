import { fetchClient } from "@shared/lib/fetchClient"
import { ApiResponse } from "@shared/types/response"

import type { GameListItem } from "../model"
import { mapStatusToErrorResponse } from "../utils"
import { toQueryString } from "../utils/toQueryString"

export interface GetMyGamesRequest {
  cursorGameId?: string
  cursorUpdatedAt?: string
  limit: number
}

export interface GetMyGamesResponse {
  result: "SUCCESS" | "ERROR"
  data: {
    games: GameListItem[]
  } | null
  error: {
    code: string
    message: string
  } | null
}

export async function getMyGames(
  params: GetMyGamesRequest,
): Promise<GetMyGamesResponse | ApiResponse<null>> {
  const queryString = toQueryString(params)
  const response = await fetchClient.fetch(`/user/me/games?${queryString}`, {
    method: "GET",
  })

  if (!response.ok) {
    return mapStatusToErrorResponse(response.status)
  }

  return response.json()
}
