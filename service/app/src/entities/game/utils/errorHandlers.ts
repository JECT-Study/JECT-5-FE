import { UUID } from "@shared/types/common";
import { ApiResponse } from "@shared/types/response";

export const createErrorResponse = (
  code: number | string,
  message: string,
  data: unknown = null
): ApiResponse<null> => {
  return {
    result: "ERROR",
    data: null,
    error: {
      code,
      message,
      data,
    },
  };
};

const createUnauthorizedErrorResponse = () =>
  createErrorResponse("E401", "로그인이 필요합니다.");

const gameUnauthorizedErrorResponse = (gameId: UUID) =>
  createErrorResponse("E403", "해당 게임에 대한 권한이 없습니다.", { gameId });

const gameNotFoundErrorResponse = (gameId: UUID) =>
  createErrorResponse("E404", "해당 게임이 존재하지 않습니다.", { gameId });

const createGameConflictErrorResponse = (data?: unknown) =>
  createErrorResponse("E409", "해당 UUID를 사용하는 게임이 이미 존재합니다.", data);

export const mapStatusToErrorResponse = (
  status: number,
  gameId?: UUID
): ApiResponse<null> => {
  switch (status) {
    case 401:
      return createUnauthorizedErrorResponse();
    case 403:
      return gameUnauthorizedErrorResponse(gameId!);
    case 404:
      return gameNotFoundErrorResponse(gameId!);
    case 409:
      return createGameConflictErrorResponse();
    default:
      return createErrorResponse(status, "알 수 없는 오류가 발생했습니다.");
  }
};
