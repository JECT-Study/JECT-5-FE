import { KakaoLoginData, KakaoLoginResponse } from "@/entities/auth/model/auth"

const mockKakaoLoginData: KakaoLoginData = {
  profileImageUrl: "/exampleThumbnail.jpg",
  nickname: "testUser",
  email: "test@example.com",
}

export const kakaoLoginSuccess: KakaoLoginResponse = {
  result: "SUCCESS",
  data: mockKakaoLoginData,
}
