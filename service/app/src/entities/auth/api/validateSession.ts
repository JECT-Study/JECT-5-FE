import { fetchClient } from "@/shared/api/fetchClient"

import type { UserSession, UserSessionResponse } from "../model/auth"

export const validateSession =
  async (): Promise<UserSessionResponse | null> => {
    const response = await fetchClient.get<UserSession>("users/auth/me")
    return response.json()
  }
