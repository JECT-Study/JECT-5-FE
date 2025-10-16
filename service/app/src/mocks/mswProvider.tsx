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
    process.env.NODE_ENV === "production",
  )
  const [isMswError, setIsMswError] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        if (
          process.env.NODE_ENV !== "production" ||
          process.env.NEXT_PUBLIC_TEST //테스트 환경에서 msw활용을 위해 주입되는 환경변수
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
      {isMswReady && children}
    </MSWContext.Provider>
  )
}
