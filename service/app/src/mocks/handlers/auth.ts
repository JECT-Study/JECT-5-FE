import { http, HttpResponse } from "msw"

import { KakaoLoginRequest } from "@/entities/auth/model/authRequest"

import { kakaoLoginSuccess } from "../data/auth"

export const MSW_MOCK_CODE = "someValidCode"

export const authHandlers = [
  http.post(`/login/kakao`, async ({ request }) => {
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
  http.post(`/logout`, async () => {
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
]
