"use client"
import { createContext, useContext, useEffect, useState } from "react"

interface MSWContextValue {
  isMswReady: boolean
  isMswError: boolean
}
const MSWContext = createContext<MSWContextValue>({
  isMswReady: false,
  isMswError: false,
})
export const useMsw = () => useContext(MSWContext)

export const MSWProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMswReady, setIsMswReady] = useState(false)
  const [isMswError, setIsMswError] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        if (process.env.NODE_ENV !== "production") {
          const { initMsw } = await import("./index")
          await initMsw()
        }
        setIsMswReady(true)
      } catch (error) {
        console.error("Failed to initialize MSW:", error)
        setIsMswError(true)
        setIsMswReady(false)
      }
    }

    init()
  }, [])

  if (!isMswReady) return null

  return (
    <MSWContext.Provider value={{ isMswReady, isMswError }}>
      {children}
    </MSWContext.Provider>
  )
}
