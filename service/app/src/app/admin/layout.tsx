"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { validateSession } from "@/entities/auth/api/validateSession"

import { AdminNavigation } from "./_components/adminNavigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    validateSession()
      .then((user) => {
        if (!user || user.data?.role !== "ADMIN") {
          router.replace("/")
          return
        }
        setChecked(true)
      })
      .catch(() => {
        router.replace("/")
      })
  }, [router])

  if (!checked) {
    return null
  }

  return (
    <div>
      <AdminNavigation />
      <main className="h-screen pt-[90px]">{children}</main>
    </div>
  )
}
