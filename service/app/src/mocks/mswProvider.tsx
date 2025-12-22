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
  const shouldInitMsw =
    process.env.NODE_ENV !== "production" || !!process.env.NEXT_PUBLIC_TEST

  const [isMswReady, setIsMswReady] = useState(!shouldInitMsw)
  const [isMswError, setIsMswError] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        if (shouldInitMsw) {
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
  }, [shouldInitMsw])

  return (
    <MSWContext.Provider value={{ isMswReady, isMswError }}>
      {isMswReady && children}
    </MSWContext.Provider>
  )
}
