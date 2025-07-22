import { fetchClient } from "@shared/lib/fetchClient";
import { UUID } from "@shared/types/common";
import { ApiResponse } from "@shared/types/response";
import { mapStatusToErrorResponse } from "../utils";

export const playGame = async (gameId: UUID): Promise<ApiResponse<null>> => {
  const response = await fetchClient.fetch(`/games/${gameId}/plays`, {
    method: 'POST',
  });

  if (!response.ok) {
    return mapStatusToErrorResponse(response.status, gameId);
  }

  return response.json();
}; 