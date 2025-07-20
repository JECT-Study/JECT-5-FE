import { fetchClient } from "@shared/lib/fetchClient";
import { GameDetailResponse } from "../model";
import { UUID } from "@shared/types/common";

export const getGameDetail = async (gameId: UUID): Promise<GameDetailResponse> => {
  const response = await fetchClient.fetch(`/games/${gameId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to get game detail: ${response.statusText}`);
  }

  return response.json();
}; 