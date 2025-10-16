"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { useAuthStore } from "../../store/useAuthStore"

export const useAuthGuard = () => {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.")
      router.push("/")
    }
  }, [isAuthenticated, router])
}
