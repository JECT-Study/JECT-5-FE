import { fetchClient } from "@shared/lib/fetchClient";
import { UUID } from "@shared/types/common";
import { ApiResponse } from "@shared/types/response";

export const shareGame = async (gameId: UUID): Promise<ApiResponse<null>> => {
  const response = await fetchClient.fetch(`/games/${gameId}/share`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Failed to share game: ${response.statusText}`);
  }

  return response.json();
};

export const unshareGame = async (gameId: UUID): Promise<ApiResponse<null>> => {
  const response = await fetchClient.fetch(`/games/${gameId}/unshare`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Failed to unshare game: ${response.statusText}`);
  }

  return response.json();
}; 