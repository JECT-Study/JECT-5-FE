import { KakaoLoginData, KakaoLoginResponse } from "@/entities/auth/model/auth"

const mockKakaoLoginData: KakaoLoginData = {
  profileImageUrl: "/avatar.svg",
  nickname: "testUser",
  email: "test@example.com",
  role: "ADMIN",
}

export const kakaoLoginSuccess: KakaoLoginResponse = {
  result: "SUCCESS",
  data: mockKakaoLoginData,
  error: null,
}

export const userInfoSuccess: KakaoLoginResponse = {
  result: "SUCCESS",
  data: mockKakaoLoginData,
  error: null,
}
