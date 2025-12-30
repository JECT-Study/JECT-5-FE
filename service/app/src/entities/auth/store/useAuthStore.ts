import { create } from "zustand"

import { kakaoLogin } from "../api/kakaoLogin"
import { logout } from "../api/logout"
import { validateSession } from "../api/validateSession"

type AuthStatus = "unknown" | "authenticated" | "unauthenticated"
type AuthUser = { nickname: string; profileImageUrl: string }

type AuthState = {
  authStatus: AuthStatus
  user: AuthUser | null
  hasBootstrapped: boolean
  login: (code: string) => Promise<void>
  logout: () => Promise<void>
  bootstrap: () => Promise<void>
  setUnauthenticated: () => void
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  authStatus: "unknown",
  user: null,
  hasBootstrapped: false,

  bootstrap: async () => {
    if (get().hasBootstrapped) return
    try {
      await validateSession()
      set({ authStatus: "authenticated" })
    } catch (error) {
      set({ authStatus: "unauthenticated" })
    }
    set({ hasBootstrapped: true })
  },

  login: async (code: string) => {
    try {
      const { profileImageUrl, nickname } = (await kakaoLogin(code)).data
      set({ user: { profileImageUrl, nickname }, authStatus: "authenticated" })
    } catch (error) {
      throw new Error("login failed")
    }
  },

  logout: async () => {
    await logout()
    set({ authStatus: "unauthenticated", user: null })
  },

  setUnauthenticated: () => set({ authStatus: "unauthenticated", user: null }),
}))
