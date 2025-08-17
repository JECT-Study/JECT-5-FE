import { Sun, SunFilled } from "../../icons"
import { SecondaryGhostIconButton } from "../button"

interface ThemeToggleProps {
  className?: string
  theme?: "light" | "dark" | undefined
  onThemeToggle?: () => void
  ariaLabel?: string
}

export const ThemeToggle = ({ 
  className = "", 
  theme = "light",
  onThemeToggle ,
  ariaLabel,
}: ThemeToggleProps) => {
  const handleThemeToggle = () => {
    onThemeToggle?.()
  }

  const isDark = theme === "dark"
  const label = ariaLabel || (isDark ? "라이트 모드 전환" : "다크 모드 전환")

  return (
    <SecondaryGhostIconButton onClick={handleThemeToggle} className={className} type="button" aria-label={label} aria-pressed={isDark} title={label}>
      {theme === "dark" ? <SunFilled aria-hidden="true" /> : <Sun aria-hidden="true" />}
    </SecondaryGhostIconButton>
  )
}
