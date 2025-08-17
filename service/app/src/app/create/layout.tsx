"use client"

import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

import { useAuth } from "@/entities/auth"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasRedirected) {
      setHasRedirected(true)
      router.replace("/login")
    }
  }, [isAuthenticated, isLoading, router, hasRedirected])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-primary">
        <div className="text-text-primary">로딩 중...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <div>{children}</div>
}
