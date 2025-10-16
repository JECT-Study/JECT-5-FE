import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

type ViMock = ReturnType<typeof vi.fn>

import {
  startPeriodicSessionValidation,
  validateSessionWithRequest,
} from "../sessionValidator"

vi.mock("@/shared/api/fetchClient", () => ({
  fetchClient: {
    get: vi.fn(),
  },
  isError: vi.fn(),
}))

describe("Session Validator", () => {
  let mockFetch: ViMock
  let mockIsError: ViMock

  beforeEach(async () => {
    vi.clearAllMocks()

    const { fetchClient, isError } = await import("@/shared/api/fetchClient")
    mockFetch = fetchClient.get as unknown as ViMock
    mockIsError = isError as unknown as ViMock
    mockIsError.mockReturnValue(false)

    Object.defineProperty(window, "localStorage", {
      value: {
        removeItem: vi.fn(),
      },
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("validateSessionWithRequest", () => {
    it("세션이 유효한 경우 true를 반환해야 한다", async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
      } as Response)

      const result = await validateSessionWithRequest()

      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it("401 응답 시 세션이 만료된 것으로 간주해야 한다", async () => {
      mockIsError.mockReturnValue(true)
      mockFetch.mockRejectedValue({
        response: {
          status: 401,
        },
      })

      const result = await validateSessionWithRequest()

      expect(result.isValid).toBe(false)
      expect(result.error).toBe("session expired")
    })

    it("네트워크 에러 시 false를 반환해야 한다", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"))

      const result = await validateSessionWithRequest()

      expect(result.isValid).toBe(false)
      expect(result.error).toBe("unknown error")
    })
  })

  describe("startPeriodicSessionValidation", () => {
    it("주기적 검증을 시작하고 정리 함수를 반환해야 한다", () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
      } as Response)

      const cleanup = startPeriodicSessionValidation(1000) // 1초마다

      expect(typeof cleanup).toBe("function")

      // 정리 함수 실행
      cleanup()
    })

    it("세션 만료 시 콜백을 실행해야 한다", async () => {
      mockIsError.mockReturnValue(true)
      mockFetch.mockRejectedValue({
        response: {
          status: 401,
        },
      })

      const onSessionExpired = vi.fn()
      const cleanup = startPeriodicSessionValidation(100, onSessionExpired)

      await new Promise((resolve) => setTimeout(resolve, 150))

      expect(onSessionExpired).toHaveBeenCalled()

      cleanup()
    })
  })
})
