"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <PrimaryBoxButton onClick={() => router.replace("./setup")}>
        Try again
      </PrimaryBoxButton>
    </div>
  )
}
