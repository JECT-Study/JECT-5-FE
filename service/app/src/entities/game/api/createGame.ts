import { fetchClient } from "@shared/lib/fetchClient";

import { GameCreateRequest } from "../model";
import { 
  generateUniqueFileName,
  uploadMultipleFilesToS3, 
  validateMultipleFiles,
} from "../utils";
import { getPresignedUrlsForNewGame } from "./getPresignedUrl";
import {
  createErrorResponse,
  mapStatusToErrorResponse,
} from "../utils/errorHandlers";
import { ApiResponse } from "@shared/types/response";


export const createGame = async (
    gameData: Omit<GameCreateRequest, 'gameId'>,
    imageFiles: File[]
  ): Promise<ApiResponse<null>> => {
      const validation = validateMultipleFiles(imageFiles);
      if (!validation.isValid) {
        return createErrorResponse(400, validation.error ?? 'Failed to validate image files');
      }
  
      const uniqueFileNames = imageFiles.map((file, index) => ({
        imageName: generateUniqueFileName(file.name),
        questionOrder: index,
      }));
  
      const presignedResponse = await getPresignedUrlsForNewGame(uniqueFileNames);
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
  
      const gameCreateRequest: GameCreateRequest = {
        ...gameData,
        gameId: presignedResponse.data.gameId,
        questions: gameData.questions.map((question, index) => ({
          ...question,
          imageUrl: presignedResponse.data!.presignedUrls[index].key,
        })),
      };
  
      const response = await fetchClient.fetch('/games', {
        method: 'POST',
        body: JSON.stringify(gameCreateRequest),
      });
  
      if (!response.ok) {
        return mapStatusToErrorResponse(response.status, presignedResponse.data.gameId);
      }

      return response.json();
  };