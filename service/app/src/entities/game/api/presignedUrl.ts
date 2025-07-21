import { fetchClient } from "@shared/lib/fetchClient";
import { UUID } from "@shared/types/common";

import { PresignedUrlRequest, PresignedUrlResponse } from "../model";

export const getPresignedUrlsForNewGame = async (
  images: PresignedUrlRequest['images']
): Promise<PresignedUrlResponse> => {
  const response = await fetchClient.fetch('/games/uploads/urls', {
    method: 'POST',
    body: JSON.stringify({ images }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get presigned URLs: ${response.statusText}`);
  }

  return response.json();
};

export const getPresignedUrlsForExistingGame = async (
  gameId: UUID,
  images: PresignedUrlRequest['images']
): Promise<PresignedUrlResponse> => {
  const response = await fetchClient.fetch(`/games/${gameId}/uploads/urls`, {
    method: 'POST',
    body: JSON.stringify({ images }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get presigned URLs: ${response.statusText}`);
  }

  return response.json();
}; 