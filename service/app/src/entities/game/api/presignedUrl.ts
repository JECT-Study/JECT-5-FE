import { fetchClient } from "@shared/lib/fetchClient";
import { PresignedUrlRequest, PresignedUrlResponse } from "../model";
import { UUID } from "@shared/types/common";

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