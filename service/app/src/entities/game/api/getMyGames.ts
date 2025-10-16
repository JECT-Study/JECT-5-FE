import { fetchClient } from "@/shared/api/fetchClient"

import type { GameListData } from "../model"
import { toQueryString } from "../utils/toQueryString"

export interface GetMyGamesRequest {
  cursorGameId?: string
  cursorUpdatedAt?: string
  limit: number
}

export async function getMyGames(params: GetMyGamesRequest) {
  const queryString = toQueryString(params)
  const response = await fetchClient.get<GameListData>(
    `users/me/games?${queryString}`,
  )
  return response.json()
}
