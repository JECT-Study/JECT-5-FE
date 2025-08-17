"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { kakaoLogin } from "../api/kakaoLogin"
import type { KakaoLoginData } from "../model/auth"
import { deleteCookie } from "../utils/cookieUtils"
import { startPeriodicSessionValidation } from "../utils/sessionValidator"

interface UseAuthReturn {
  user: KakaoLoginData | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (code?: string) => Promise<void>
  logout: () => void
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<KakaoLoginData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const _router = useRouter()

  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null)
      localStorage.removeItem("auth_user")
      deleteCookie("sessionId")
    }

    window.addEventListener("auth:session-expired", handleSessionExpired)

    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired)
    }
  }, [])

  useEffect(() => {
    if (!user) return

    const cleanup = startPeriodicSessionValidation(5 * 60 * 1000, () => {
      setUser(null)
      localStorage.removeItem("auth_user")
      deleteCookie("sessionId")
    })

    return cleanup
  }, [user])

  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("auth_user")
      }
    }
  }, [])

  const login = useCallback(async (code?: string) => {
    setIsLoading(true)
    try {
      const mockCode = code || "someValidCode"
      const response = await kakaoLogin(mockCode)

      if (response.result === "SUCCESS" && response.data) {
        setUser(response.data)
        localStorage.setItem("auth_user", JSON.stringify(response.data))
      } else {
        throw new Error("Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("auth_user")
    deleteCookie("sessionId")
    window.dispatchEvent(new CustomEvent("auth:session-expired"))
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  }
}
