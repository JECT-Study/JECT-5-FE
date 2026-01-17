import { fetchClient } from "@/shared/api/fetchClient"

import { UserSessionResponse } from "../model/auth"

export const validateSession =
  async (): Promise<UserSessionResponse | null> => {
    const response = await fetchClient.get<null>("auth/me")
    return response.json()
  }
