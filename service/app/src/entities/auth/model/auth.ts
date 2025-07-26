import type { ApiResponse } from "@shared/types/response"

export interface KakaoLoginData {
  profileImageUrl: string
  nickname: string
  email: string
}

export type KakaoLoginResponse = ApiResponse<KakaoLoginData>
