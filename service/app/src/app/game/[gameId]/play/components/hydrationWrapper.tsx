"use client"

import { useGameStoreContext } from "../../store/gameProvider"

interface HydrationWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function HydrationWrapper({
  children,
  fallback = null,
}: HydrationWrapperProps) {
  const gameStoreApi = useGameStoreContext()

  // 하이드레이션이 완료되지 않았으면 fallback 렌더링
  if (!gameStoreApi.persist.hasHydrated()) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
