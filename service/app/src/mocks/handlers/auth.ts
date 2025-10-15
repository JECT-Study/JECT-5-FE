import { http, HttpResponse } from "msw"

import { KakaoLoginRequest } from "@/entities/auth/model/authRequest"

import { kakaoLoginSuccess } from "../data/auth"

const MSW_BASE_URL = process.env.MSW_BASE_URL || "http://localhost:3000"
export const MSW_MOCK_CODE = "someValidCode"

export const authHandlers = [
  http.post(`${MSW_BASE_URL}/login/kakao`, async ({ request }) => {
    const { code, type } = (await request.json()) as KakaoLoginRequest
    if (code === MSW_MOCK_CODE && type === "kakao") {
      return new HttpResponse(JSON.stringify(kakaoLoginSuccess), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": "JSESSIONID=test-session-123; Path=/; SameSite=Lax",
        },
      })
    }
    return new HttpResponse("Unauthorized", { status: 401 })
  }),
  http.post(`${MSW_BASE_URL}/logout`, async () => {
    return new HttpResponse(JSON.stringify({}), {
      status: 200,
    })
  }),
]
