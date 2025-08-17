"use client"

import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

import { useAuth } from "@/entities/auth"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) return null
  if (!isAuthenticated) return null

  return <div>{children}</div>
}
