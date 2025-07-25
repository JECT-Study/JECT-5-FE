import { fetchClient } from "@shared/lib/fetchClient";

export const kakaoLogin = async (code: string) => {
  const response = await fetchClient.fetch('/login/kakao', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });

  return response.json();
};