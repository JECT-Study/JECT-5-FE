import { fetchClient } from "@/shared/api/fetchClient"

import type { GameListData, GameQueryParams } from "../model"
import { toQueryString } from "../utils/toQueryString"

export const getGameList = async (params: GameQueryParams) => {
  const queryString = toQueryString(params)
  const response = await fetchClient.get<GameListData>(`games?${queryString}`)
  return response.json()
}
