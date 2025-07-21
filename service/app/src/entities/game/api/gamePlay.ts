import { fetchClient } from "@shared/lib/fetchClient";
import { UUID } from "@shared/types/common";
import { ApiResponse } from "@shared/types/response";

export const GamePlay = async (gameId: UUID): Promise<ApiResponse<null>> => {
  const response = await fetchClient.fetch(`/games/${gameId}/plays`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Failed to increment game play count: ${response.statusText}`);
  }

  return response.json();
}; 