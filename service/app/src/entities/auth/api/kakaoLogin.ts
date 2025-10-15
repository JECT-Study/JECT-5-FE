import { fetchClient } from "@/shared/api/fetchClient"

import { KakaoLoginData } from "../model/auth"

export const kakaoLogin = async (code: string) => {
  const response = await fetchClient.post<KakaoLoginData>("login/kakao", {
    json: { code, type: "kakao" },
  })

  return response.json()
}
