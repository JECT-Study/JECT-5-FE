import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { kakaoLogin } from "../api/kakaoLogin"
import { logout } from "../api/logout"
import { KakaoLoginData } from "../model/auth"
import { deleteCookie, getSessionId } from "../utils/cookieUtils"

type AuthState = {
  user: KakaoLoginData | null
  isAuthenticated: boolean
  _hasHydrated: boolean
  login: (code: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: !!getSessionId(),
      _hasHydrated: false,

      login: async (code: string) => {
        try {
          const res = await kakaoLogin(code)
          set({ user: res.data, isAuthenticated: true })
        } catch (error) {
          throw new Error("login failed")
        }
      },

      logout: async () => {
        await logout()
        deleteCookie("JSESSIONID")
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true
        }
      },
    },
  ),
)
