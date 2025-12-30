import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { useAuthStore } from "../../store/useAuthStore"

export const useAuthGuard = () => {
  const router = useRouter()
  const { authStatus } = useAuthStore()

  useEffect(() => {
    if (authStatus !== "authenticated") {
      alert("로그인이 필요합니다.")
      router.replace("/")
    }
  }, [authStatus, router])
}
