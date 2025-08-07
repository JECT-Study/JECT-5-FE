"use client"

import { OverlayProvider } from "overlay-kit"

interface OverlayProviderWrapperProps {
  children: React.ReactNode
}

export function OverlayProviderWrapper({ children }: OverlayProviderWrapperProps) {
  return <OverlayProvider>{children}</OverlayProvider>
} 