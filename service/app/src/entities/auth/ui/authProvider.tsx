"use client"

import { useEffect } from "react"

import { useAuthStore } from "../store/useAuthStore"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { bootstrap, setUnauthenticated } = useAuthStore()
  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  useEffect(() => {
    window.addEventListener("auth:session-expired", setUnauthenticated)
    return () => {
      window.removeEventListener("auth:session-expired", setUnauthenticated)
    }
  }, [setUnauthenticated])

  return <>{children}</>
}
