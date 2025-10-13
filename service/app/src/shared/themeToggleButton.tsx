"use client"

import { SecondaryGhostIconButton } from "@ject-5-fe/design/components/button"
import { Sun, SunFilled } from "@ject-5-fe/design/icons"
import { useTheme } from "next-themes"

import { useIsMounted } from "./lib/useIsMounted"

interface ThemeToggleProps {
  className?: string
}

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { resolvedTheme, theme, setTheme } = useTheme()
  const isMounted = useIsMounted()

  if (!isMounted) {
    return null
  }

  const isDark = (resolvedTheme ?? theme ?? "light") === "dark"
  const srText = isDark
    ? "다크 모드에서 라이트 모드로"
    : "라이트 모드에서 다크 모드로"

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <SecondaryGhostIconButton
      onClick={handleThemeToggle}
      className={className}
      data-testid="theme-toggle-button"
    >
      <span className="sr-only">{srText}</span>
      {isDark ? <SunFilled aria-hidden="true" /> : <Sun aria-hidden="true" />}
    </SecondaryGhostIconButton>
  )
}
