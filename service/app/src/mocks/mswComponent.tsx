"use client"

import { useEffect, useRef, useState } from "react"

export const MSWComponent = ({ children }: { children: React.ReactNode }) => {
  const [mswReady, setMswReady] = useState(false)
  const hasStartedRef = useRef(false)

  useEffect(() => {
    const init = async () => {
      if (hasStartedRef.current) return
      hasStartedRef.current = true

      const { initMsw } = await import("./index")
      if (process.env.NODE_ENV !== "production") {
        await initMsw()
      }
      setMswReady(true)
    }

    if (!mswReady) {
      init()
    }
  }, [mswReady])

  return <>{children}</>
}
