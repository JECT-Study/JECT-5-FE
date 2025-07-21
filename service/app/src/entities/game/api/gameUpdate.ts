import { fetchClient } from "@shared/lib/fetchClient";
import { UUID } from "@shared/types/common";
import { ApiResponse } from "@shared/types/response";

import { GameUpdateRequest } from "../model";

export const updateGame = async (
  gameId: UUID,
  gameData: GameUpdateRequest
): Promise<ApiResponse<null>> => {
  const response = await fetchClient.fetch(`/games/${gameId}`, {
    method: 'PUT',
    body: JSON.stringify(gameData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update game: ${response.statusText}`);
  }

  return response.json();
}; 