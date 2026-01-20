import { http, HttpResponse } from "msw"

import { KakaoLoginRequest } from "@/entities/auth/model/authRequest"

import { kakaoLoginSuccess, userInfoSuccess } from "../data/auth"
import { loginRequiredError } from "../data/common"
import { validateSessionCookie } from "../utils/gameHandlers"

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
    return new HttpResponse(
      JSON.stringify({
        result: "SUCCESS",
        data: null,
        error: null,
      }),
      {
        status: 200,
        headers: {
          "Set-Cookie": "JSESSIONID=; Max-Age=0; Path=/; SameSite=Lax",
        },
      },
    )
  }),
  http.get(`${MSW_BASE_URL}/users/auth/me`, async ({ request }) => {
    const cookieHeader = request.headers.get("Cookie")
    if (!validateSessionCookie(cookieHeader)) {
      return HttpResponse.json(loginRequiredError, { status: 401 })
    }
    return new HttpResponse(JSON.stringify(userInfoSuccess), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }),
]
