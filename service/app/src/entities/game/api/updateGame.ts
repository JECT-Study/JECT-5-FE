import { fetchClient } from "@shared/lib/fetchClient";
import { UUID } from "@shared/types/common";
import { ApiResponse } from "@shared/types/response";

import { GameUpdateRequest } from "../model";
import { generateUniqueFileName,validateMultipleFiles } from "../utils";
import { createErrorResponse, mapStatusToErrorResponse } from "../utils/errorHandlers";
import { uploadMultipleFilesToS3 } from "../utils/s3Upload";
import { getPresignedUrlsForExistingGame } from "./getPresignedUrl";

export const updateGame = async (
  gameData: GameUpdateRequest,
  imageFiles: File[],
  gameId: UUID
): Promise<ApiResponse<null>> => {
  const validation = validateMultipleFiles(imageFiles);
  if (!validation.isValid) {
    return createErrorResponse(400, validation.error ?? 'Failed to validate image files');
  }
  const fileData = imageFiles.map((file, index) => ({
    imageName: file.name == null ? file.name : generateUniqueFileName(file.name),
    questionOrder: index,
  }));

  const presignedResponse = await getPresignedUrlsForExistingGame(gameId, fileData);
  if (presignedResponse.result !== 'SUCCESS' || !presignedResponse.data) {
    return createErrorResponse(500, 'Failed to get presigned URLs');
  }

  const uploadResult = await uploadMultipleFilesToS3(
    imageFiles,
    presignedResponse.data.presignedUrls
  );
  if (!uploadResult.success) {
    return createErrorResponse(500, uploadResult.error ?? 'Failed to upload images to S3');
  }

  const gameUpdateRequest: GameUpdateRequest = {
    ...gameData,
    questions: gameData.questions.map((question, index) => ({
      ...question,
      imageUrl: imageFiles[index] ? presignedResponse.data!.presignedUrls[index].key : question.imageUrl,
    })),
  };

  const response = await fetchClient.fetch(`/games/${gameId}`, {
    method: 'PUT',
    body: JSON.stringify(gameUpdateRequest),
  });

  if (!response.ok) {
    return mapStatusToErrorResponse(response.status);
  }

  return response.json();
}; 