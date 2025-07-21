import { fetchClient } from "@shared/lib/fetchClient";
import { UUID } from "@shared/types/common";

import { GameCreateRequest, GameUpdateRequest } from "../model";
import { generateUniqueFileName,uploadMultipleFilesToS3, validateMultipleFiles } from "../utils";
import { getPresignedUrlsForExistingGame,getPresignedUrlsForNewGame } from "./presignedUrl";

export interface GameSaveResult {
  success: boolean;
  gameId?: UUID;
  error?: string;
}

export const saveNewGame = async (
  gameData: Omit<GameCreateRequest, 'gameId'>,
  imageFiles: File[]
): Promise<GameSaveResult> => {
  try {
    const validation = validateMultipleFiles(imageFiles);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const uniqueFileNames = imageFiles.map((file, index) => ({
      imageName: generateUniqueFileName(file.name),
      questionOrder: index,
    }));

    const presignedResponse = await getPresignedUrlsForNewGame(uniqueFileNames);
    if (presignedResponse.result !== 'SUCCESS' || !presignedResponse.data) {
      return { success: false, error: 'Failed to get presigned URLs' };
    }

    const uploadResult = await uploadMultipleFilesToS3(
      imageFiles,
      presignedResponse.data.presignedUrls
    );
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
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
      throw new Error(`Failed to save game: ${response.statusText}`);
    }

    return {
      success: true,
      gameId: presignedResponse.data.gameId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const updateExistingGame = async (
  gameId: UUID,
  gameData: Omit<GameUpdateRequest, 'gameId'>,
  imageFiles: File[]
): Promise<GameSaveResult> => {
  try {
    const validation = validateMultipleFiles(imageFiles);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const uniqueFileNames = imageFiles.map((file, index) => ({
      imageName: generateUniqueFileName(file.name),
      questionOrder: index,
    }));

    const presignedResponse = await getPresignedUrlsForExistingGame(gameId, uniqueFileNames);
    if (presignedResponse.result !== 'SUCCESS' || !presignedResponse.data) {
      return { success: false, error: 'Failed to get presigned URLs' };
    }

    const uploadResult = await uploadMultipleFilesToS3(
      imageFiles,
      presignedResponse.data.presignedUrls
    );
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }

    const gameUpdateRequest: GameUpdateRequest = {
      ...gameData,
      questions: gameData.questions.map((question, index) => ({
        ...question,
        imageUrl: presignedResponse.data!.presignedUrls[index].key,
      })),
    };

    const response = await fetchClient.fetch(`/games/${gameId}`, {
      method: 'PUT',
      body: JSON.stringify(gameUpdateRequest),
    });

    if (!response.ok) {
      throw new Error(`Failed to update game: ${response.statusText}`);
    }

    return {
      success: true,
      gameId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}; 