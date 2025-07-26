export const generateSuccessResponse = <T>(data: T) => ({
  result: "SUCCESS" as const,
  data,
  error: null,
})

export const generateErrorResponse = (
  code: string,
  message: string,
  data?: Record<string, unknown>,
) => ({
  result: "ERROR" as const,
  data: null,
  error: { code, message, data },
})

export const generateCommonErrorResponse = {
  loginRequired: () => generateErrorResponse("E401", "로그인이 필요합니다."),
  internalServerError: () =>
    generateErrorResponse("E500", "internal server error"),
}

export const generateGameErrorResponse = {
  notFound: (gameId: string) =>
    generateErrorResponse("E404", "해당 게임이 존재하지 않습니다.", { gameId }),

  unauthorized: () =>
    generateErrorResponse("E403", "해당 게임에 대한 권한이 없습니다."),

  alreadyExists: (gameId: string) =>
    generateErrorResponse(
      "E409",
      "해당 UUID를 사용하는 게임이 이미 존재합니다.",
      { gameId },
    ),

  modified: (gameId: string) =>
    generateErrorResponse("E409", "해당 게임의 정보가 변경되었습니다.", {
      gameId,
    }),
}
