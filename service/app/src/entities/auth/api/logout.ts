import { fetchClient } from "@/shared/api/fetchClient"

export const logout = async () => {
  const response = await fetchClient.post<null>("logout", {})
  return response.json()
}
