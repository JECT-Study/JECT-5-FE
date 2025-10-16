import { fetchClient } from "@/shared/api/fetchClient"

import { GameListData } from "../model"

export const getDefaultGame = async ({ ...options }: RequestInit = {}) => {
  const response = await fetchClient.get<GameListData>("games/default", {
    ...options,
  })
  return response.json()
}
