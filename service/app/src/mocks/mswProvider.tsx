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
  const [isMswReady, setIsMswReady] = useState(
    process.env.NODE_ENV === "production" || !!process.env.NEXT_PUBLIC_TEST,
  )
  const [isMswError, setIsMswError] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        if (
          process.env.NODE_ENV !== "production" ||
          !process.env.NEXT_PUBLIC_TEST
        ) {
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

  return (
    <MSWContext.Provider value={{ isMswReady, isMswError }}>
      {children}
    </MSWContext.Provider>
  )
}
