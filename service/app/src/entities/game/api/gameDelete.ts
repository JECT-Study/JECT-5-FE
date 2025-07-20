import { fetchClient } from "@shared/lib/fetchClient";
import { UUID } from "@shared/types/common";
import { ApiResponse } from "@shared/types/response";

export interface GameDeleteResponse extends ApiResponse<null> {}

export const deleteGame = async (gameId: UUID): Promise<GameDeleteResponse> => {
  const response = await fetchClient.fetch(`/games/${gameId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete game: ${response.statusText}`);
  }

  return response.json();
}; 