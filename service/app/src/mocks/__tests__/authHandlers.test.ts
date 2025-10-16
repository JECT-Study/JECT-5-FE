import { describe, expect, it } from "vitest"

import type { KakaoLoginData } from "@/entities/auth"
import type { KakaoLoginRequest } from "@/entities/auth/model/authRequest"
import { fetchClient } from "@/shared/api/fetchClient"

const testFetchClient = fetchClient

describe("Auth API Handlers", () => {
  describe("POST /login/kakao", () => {
    const mockKakaoLoginRequest: KakaoLoginRequest = {
      code: "someValidCode",
      type: "kakao",
    }

    it("유효한 카카오 로그인 요청을 처리할 수 있어야 한다", async () => {
      const response = await testFetchClient.post<KakaoLoginData>(
        "login/kakao",
        {
          headers: {
            "Content-Type": "application/json",
          },
          json: mockKakaoLoginRequest,
        },
      )

      const { data } = await response.json()

      expect(data).toHaveProperty("profileImageUrl")
      expect(data).toHaveProperty("nickname")
      expect(data).toHaveProperty("email")
      expect(data.nickname).toBe("testUser")
      expect(data.email).toBe("test@example.com")
    })

    it("세션 쿠키가 응답 헤더에 포함되어야 한다", async () => {
      const response = await testFetchClient.post("login/kakao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        json: mockKakaoLoginRequest,
      })

      expect(response.ok).toBe(true)
      expect(response.headers.get("Set-Cookie")).toContain("JSESSIONID=")
    })
  })
})
