"use client"
import { createContext, useContext, useEffect, useState } from "react"

interface MSWContextValue { isMswReady: boolean }
const MSWContext = createContext<MSWContextValue>({ isMswReady: false })
export const useMsw = () => useContext(MSWContext)

export const MSWProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMswReady, setIsMswReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      if (process.env.NODE_ENV !== "production") {
        const { initMsw } = await import("./index")
        await initMsw()
      }
      setIsMswReady(true)
    }
    init()
  }, [])

  return (
    <MSWContext.Provider value={{ isMswReady }}>
      {children}
    </MSWContext.Provider>
  )
}
