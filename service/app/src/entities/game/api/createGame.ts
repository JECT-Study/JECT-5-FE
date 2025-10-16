import { fetchClient } from "@/shared/api/fetchClient"

import { GameCreateRequest } from "../model"

export const createGame = async (gameData: GameCreateRequest) => {
  const response = await fetchClient.post<null>("games", {
    json: gameData,
  })
  return response.json()
}
