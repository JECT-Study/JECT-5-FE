import type { ApiResponse } from "@/shared/api/types/response"

export interface KakaoLoginData {
  profileImageUrl: string
  nickname: string
  email: string
}

export type KakaoLoginResponse = ApiResponse<KakaoLoginData>
