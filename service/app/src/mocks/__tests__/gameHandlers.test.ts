import { createFetchClient } from "@shared/lib/fetchClientFactory"
import { describe, expect, it } from "vitest"

const testFetchClient = createFetchClient({
  baseUrl: process.env.MSW_BASE_URL || "http://localhost:3000",
  defaultHeaders: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  credentials: "include",
})
import {
  GameCreateRequest,
  GameUpdateRequest,
  PresignedUrlRequest,
} from "@/entities/game"

describe("Game API Handlers", () => {
  const mockSessionCookie = "JSESSIONID=test-session-123"

  describe("GET /games", () => {
    it("게임 목록을 성공적으로 조회해야 한다", async () => {
      const response = await testFetchClient.fetch("/games")
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.result).toBe("SUCCESS")
      expect(data.data).toHaveProperty("games")
      expect(Array.isArray(data.data.games)).toBe(true)
    })

    it("쿼리 파라미터로 게임을 필터링할 수 있어야 한다", async () => {
      const response = await testFetchClient.fetch("/games?query=test&limit=5")
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.result).toBe("SUCCESS")
    })

    it("페이지네이션 파라미터를 처리할 수 있어야 한다", async () => {
      const listResponse = await testFetchClient.fetch("/games")
      const listData = await listResponse.json()

      if (listData.data.games.length === 0) {
        throw new Error("게임 목록이 비어있습니다.")
      }

      const firstGame = listData.data.games[0]
      const response = await testFetchClient.fetch(
        `/games?cursorGameId=${firstGame.gameId}&cursorPlayCount=${firstGame.playCount}&cursorUpdatedAt=${firstGame.updatedAt}&limit=3`,
      )
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.result).toBe("SUCCESS")
      expect(data.data.games).toBeDefined()
      expect(data.data.games.length).toBeLessThanOrEqual(3)
    })
  })

  describe("GET /games/:gameId", () => {
    it("존재하는 게임의 상세 정보를 조회할 수 있어야 한다", async () => {
      const listResponse = await testFetchClient.fetch("/games")
      const listData = await listResponse.json()
      const gameId = listData.data.games[0]?.gameId

      if (!gameId) {
        throw new Error("테스트용 게임이 없습니다")
      }

      const response = await testFetchClient.fetch(`/games/${gameId}`)
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.result).toBe("SUCCESS")
      expect(data.data).toHaveProperty("gameTitle")
      expect(data.data).toHaveProperty("nickname")
      expect(data.data).toHaveProperty("questionCount")
      expect(data.data).toHaveProperty("version")
      expect(data.data).toHaveProperty("questions")
    })

    it("존재하지 않는 게임 ID로 요청 시 404를 반환해야 한다", async () => {
      const response = await testFetchClient.fetch("/games/non-existent-id")
      const data = await response.json()

      expect(response.ok).toBe(false)
      expect(response.status).toBe(404)
      expect(data.result).toBe("ERROR")
      expect(data.error.code).toBe("E404")
    })
  })

  describe("POST /games/:gameId/plays", () => {
    it("게임 플레이 카운트를 증가시킬 수 있어야 한다", async () => {
      const listResponse = await testFetchClient.fetch("/games")
      const listData = await listResponse.json()
      const gameId = listData.data.games[0]?.gameId

      if (!gameId) {
        throw new Error("테스트용 게임이 없습니다")
      }

      const response = await testFetchClient.fetch(`/games/${gameId}/plays`, {
        method: "POST",
        headers: {
          Cookie: mockSessionCookie,
        },
      })
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.result).toBe("SUCCESS")
    })

    it("존재하지 않는 게임 ID로 요청 시 404를 반환해야 한다", async () => {
      const response = await testFetchClient.fetch(
        "/games/non-existent-id/plays",
        {
          method: "POST",
          headers: {
            Cookie: mockSessionCookie,
          },
        },
      )
      const data = await response.json()

      expect(response.ok).toBe(false)
      expect(response.status).toBe(404)
      expect(data.result).toBe("ERROR")
    })
  })

  describe("POST /games", () => {
    const mockGameCreateRequest: GameCreateRequest = {
      gameId: "test-game-123",
      gameTitle: "테스트 게임",
      gameCreatorEmail: "test@example.com",
      gameThumbnailUrl: "https://example.com/thumbnail.jpg",
      questions: [
        {
          questionText: "테스트 문제 1",
          questionAnswer: "정답 1",
          questionOrder: 0,
          imageUrl: "https://example.com/image1.jpg",
        },
        {
          questionText: "테스트 문제 2",
          questionAnswer: "정답 2",
          questionOrder: 1,
          imageUrl: "https://example.com/image2.jpg",
        },
      ],
    }

    it("유효한 게임 생성 요청을 처리할 수 있어야 한다", async () => {
      const response = await testFetchClient.fetch("/games", {
        method: "POST",
        headers: {
          Cookie: mockSessionCookie,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockGameCreateRequest),
      })
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.result).toBe("SUCCESS")
    })

    it("세션 쿠키가 없으면 401을 반환해야 한다", async () => {
      const response = await testFetchClient.fetch("/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockGameCreateRequest),
      })
      const data = await response.json()

      expect(response.ok).toBe(false)
      expect(response.status).toBe(401)
      expect(data.result).toBe("ERROR")
    })

    it("필수 필드가 누락되면 400을 반환해야 한다", async () => {
      const invalidRequest = { ...mockGameCreateRequest }
      delete (invalidRequest as Partial<GameCreateRequest>).gameTitle

      const response = await testFetchClient.fetch("/games", {
        method: "POST",
        headers: {
          Cookie: mockSessionCookie,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidRequest),
      })
      const data = await response.json()

      expect(response.ok).toBe(false)
      expect(response.status).toBe(400)
      expect(data.result).toBe("ERROR")
      expect(data.error.code).toBe("E400")
    })

    it("중복된 게임 ID로 요청 시 409를 반환해야 한다", async () => {
      await testFetchClient.fetch("/games", {
        method: "POST",
        headers: {
          Cookie: mockSessionCookie,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockGameCreateRequest),
      })

      const response = await testFetchClient.fetch("/games", {
        method: "POST",
        headers: {
          Cookie: mockSessionCookie,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockGameCreateRequest),
      })
      const data = await response.json()

      expect(response.ok).toBe(false)
      expect(response.status).toBe(409)
      expect(data.result).toBe("ERROR")
      expect(data.error.code).toBe("E409")
    })
  })

  describe("PUT /games/:gameId", () => {
    const mockGameUpdateRequest: GameUpdateRequest = {
      gameTitle: "수정된 게임 제목",
      gameCreatorEmail: "test@example.com",
      gameThumbnailUrl: "https://example.com/new-thumbnail.jpg",
      version: 1,
      questions: [
        {
          questionText: "수정된 문제 1",
          questionAnswer: "수정된 정답 1",
          questionOrder: 0,
          imageUrl: "https://example.com/image1.jpg",
          version: 1,
        },
      ],
    }

    it("유효한 게임 수정 요청을 처리할 수 있어야 한다", async () => {
      const createRequest: GameCreateRequest = {
        gameId: "update-test-game",
        gameTitle: "원본 게임",
        gameCreatorEmail: "test@example.com",
        gameThumbnailUrl: "https://example.com/thumbnail.jpg",
        questions: [
          {
            questionText: "원본 문제",
            questionAnswer: "원본 정답",
            questionOrder: 0,
            imageUrl: "https://example.com/image1.jpg",
          },
        ],
      }

      await testFetchClient.fetch("/games", {
        method: "POST",
        headers: {
          Cookie: mockSessionCookie,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createRequest),
      })

      // 게임 수정
      const response = await testFetchClient.fetch("/games/update-test-game", {
        method: "PUT",
        headers: {
          Cookie: mockSessionCookie,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockGameUpdateRequest),
      })
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.result).toBe("SUCCESS")
    })

    it("존재하지 않는 게임을 수정하려 하면 404를 반환해야 한다", async () => {
      const response = await testFetchClient.fetch("/games/non-existent-id", {
        method: "PUT",
        headers: {
          Cookie: mockSessionCookie,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockGameUpdateRequest),
      })
      const data = await response.json()

      expect(response.ok).toBe(false)
      expect(response.status).toBe(404)
      expect(data.result).toBe("ERROR")
    })

    it("버전이 맞지 않으면 409를 반환해야 한다", async () => {
      const createRequest: GameCreateRequest = {
        gameId: "version-test-game",
        gameTitle: "버전 테스트 게임",
        gameCreatorEmail: "test@example.com",
        gameThumbnailUrl: "https://example.com/thumbnail.jpg",
        questions: [
          {
            questionText: "테스트 문제",
            questionAnswer: "테스트 정답",
            questionOrder: 0,
            imageUrl: "https://example.com/image1.jpg",
          },
        ],
      }

      await testFetchClient.fetch("/games", {
        method: "POST",
        headers: {
          Cookie: mockSessionCookie,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createRequest),
      })

      const invalidUpdateRequest = { ...mockGameUpdateRequest, version: 999 }
      const response = await testFetchClient.fetch("/games/version-test-game", {
        method: "PUT",
        headers: {
          Cookie: mockSessionCookie,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidUpdateRequest),
      })
      const data = await response.json()

      expect(response.ok).toBe(false)
      expect(response.status).toBe(409)
      expect(data.result).toBe("ERROR")
      expect(data.error.code).toBe("E409")
    })
  })

  describe("DELETE /games/:gameId", () => {
    it("게임을 soft delete 할 수 있어야 한다", async () => {
      const createRequest: GameCreateRequest = {
        gameId: "delete-test-game",
        gameTitle: "삭제 테스트 게임",
        gameCreatorEmail: "test@example.com",
        gameThumbnailUrl: "https://example.com/thumbnail.jpg",
        questions: [
          {
            questionText: "테스트 문제",
            questionAnswer: "테스트 정답",
            questionOrder: 0,
            imageUrl: "https://example.com/image1.jpg",
          },
        ],
      }

      await testFetchClient.fetch("/games", {
        method: "POST",
        headers: {
          Cookie: mockSessionCookie,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createRequest),
      })

      const response = await testFetchClient.fetch("/games/delete-test-game", {
        method: "DELETE",
        headers: {
          Cookie: mockSessionCookie,
        },
      })
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.result).toBe("SUCCESS")
    })

    it("존재하지 않는 게임을 삭제하려 하면 404를 반환해야 한다", async () => {
      const response = await testFetchClient.fetch("/games/non-existent-id", {
        method: "DELETE",
        headers: {
          Cookie: mockSessionCookie,
        },
      })
      const data = await response.json()

      expect(response.ok).toBe(false)
      expect(response.status).toBe(404)
      expect(data.result).toBe("ERROR")
    })
  })

  describe("POST /games/:gameId/share", () => {
    it("게임을 공유할 수 있어야 한다", async () => {
      const createRequest: GameCreateRequest = {
        gameId: "share-test-game",
        gameTitle: "공유 테스트 게임",
        gameCreatorEmail: "test@example.com",
        gameThumbnailUrl: "https://example.com/thumbnail.jpg",
        questions: [
          {
            questionText: "테스트 문제",
            questionAnswer: "테스트 정답",
            questionOrder: 0,
            imageUrl: "https://example.com/image1.jpg",
          },
        ],
      }

      await testFetchClient.fetch("/games", {
        method: "POST",
        headers: {
          Cookie: mockSessionCookie,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createRequest),
      })

      const response = await testFetchClient.fetch(
        "/games/share-test-game/share",
        {
          method: "POST",
          headers: {
            Cookie: mockSessionCookie,
          },
        },
      )
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.result).toBe("SUCCESS")
    })
  })

  describe("POST /games/:gameId/unshare", () => {
    it("게임 공유를 해제할 수 있어야 한다", async () => {
      const createRequest: GameCreateRequest = {
        gameId: "unshare-test-game",
        gameTitle: "공유 해제 테스트 게임",
        gameCreatorEmail: "test@example.com",
        gameThumbnailUrl: "https://example.com/thumbnail.jpg",
        questions: [
          {
            questionText: "테스트 문제",
            questionAnswer: "테스트 정답",
            questionOrder: 0,
            imageUrl: "https://example.com/image1.jpg",
          },
        ],
      }

      await testFetchClient.fetch("/games", {
        method: "POST",
        headers: {
          Cookie: mockSessionCookie,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createRequest),
      })

      const response = await testFetchClient.fetch(
        "/games/unshare-test-game/unshare",
        {
          method: "POST",
          headers: {
            Cookie: mockSessionCookie,
          },
        },
      )
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.result).toBe("SUCCESS")
    })
  })

  describe("POST /games/uploads/urls", () => {
    it("새 게임용 presigned URL을 생성할 수 있어야 한다", async () => {
      const presignedRequest: PresignedUrlRequest = {
        images: [
          {
            imageName: "image1.jpg",
            questionOrder: 0,
          },
          {
            imageName: "image2.jpg",
            questionOrder: 1,
          },
          {
            imageName: "image3.jpg",
            questionOrder: 2,
          },
        ],
      }

      const response = await testFetchClient.fetch("/games/uploads/urls", {
        method: "POST",
        headers: {
          Cookie: mockSessionCookie,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(presignedRequest),
      })
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.result).toBe("SUCCESS")
      expect(data.data).toHaveProperty("gameId")
      expect(data.data).toHaveProperty("presignedUrls")
      expect(Array.isArray(data.data.presignedUrls)).toBe(true)
      expect(data.data.presignedUrls).toHaveLength(3)
    })
  })

  describe("POST /games/:gameId/uploads/urls", () => {
    it("기존 게임용 presigned URL을 생성할 수 있어야 한다", async () => {
      const presignedRequest: PresignedUrlRequest = {
        images: [
          {
            imageName: "image1.jpg",
            questionOrder: 0,
          },
          {
            imageName: "image2.jpg",
            questionOrder: 1,
          },
        ],
      }

      const response = await testFetchClient.fetch(
        "/games/existing-game-id/uploads/urls",
        {
          method: "POST",
          headers: {
            Cookie: mockSessionCookie,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(presignedRequest),
        },
      )
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.result).toBe("SUCCESS")
      expect(data.data).toHaveProperty("gameId", "existing-game-id")
      expect(data.data).toHaveProperty("presignedUrls")
      expect(Array.isArray(data.data.presignedUrls)).toBe(true)
      expect(data.data.presignedUrls).toHaveLength(2)
    })
  })
})
