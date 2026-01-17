import type { ApiResponse } from "@/shared/api/types/response"

export type UserRole = "ADMIN" | "USER" | "BLOCKED"
export interface KakaoLoginData {
  profileImageUrl: string
  nickname: string
  email: string
  role: UserRole
}

export type KakaoLoginResponse = ApiResponse<KakaoLoginData>

export interface UserSession {
  profileImageUrl: string
  nickname: string
  email: string
  role: UserRole
}

export type UserSessionResponse = ApiResponse<UserSession>
