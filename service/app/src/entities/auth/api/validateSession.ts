import { fetchClient } from "@/shared/api/fetchClient"

export const validateSession = async () => {
  const response = await fetchClient.get<null>("users/me/games?limit=1") // TODO: 엔드포인트 생성 후 변경
  return response.json()
}
