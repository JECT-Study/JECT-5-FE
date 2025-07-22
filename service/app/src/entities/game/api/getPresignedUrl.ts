import { fetchClient } from "@shared/lib/fetchClient";
import { UUID } from "@shared/types/common";

import { PresignedUrlRequest, PresignedUrlResponse } from "../model";
import { mapStatusToErrorResponse } from "../utils";
import { ApiResponse } from "@shared/types/response";

export const getPresignedUrlsForNewGame = async (
  images: PresignedUrlRequest['images']
): Promise<PresignedUrlResponse | ApiResponse<null>> => {
  const response = await fetchClient.fetch('/games/uploads/urls', {
    method: 'POST',
    body: JSON.stringify({ images }),
  });

  if (!response.ok) {
    return mapStatusToErrorResponse(response.status);
  }

  return response.json();
};

export const getPresignedUrlsForExistingGame = async (
  gameId: UUID,
  images: PresignedUrlRequest['images']
): Promise<PresignedUrlResponse | ApiResponse<null>> => {
  const response = await fetchClient.fetch(`/games/${gameId}/uploads/urls`, {
    method: 'POST',
    body: JSON.stringify({ images }),
  });

  if (!response.ok) {
    return mapStatusToErrorResponse(response.status, gameId);
  }

  return response.json();
}; 