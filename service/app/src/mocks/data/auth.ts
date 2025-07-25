import { KakaoLoginData, KakaoLoginResponse } from "@/entities/auth/model/auth";

const mockKakaoLoginData: KakaoLoginData = {
  profileImageUrl: 'https://picsum.photos/id/237/536/354',
  nickname: 'testUser',
  email: 'test@example.com',
};

export const kakaoLoginSuccess: KakaoLoginResponse = {
  result: 'SUCCESS',
  data: mockKakaoLoginData,
};

