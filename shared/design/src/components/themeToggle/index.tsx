import { Sun, SunFilled } from "../../icons"
import { SecondaryGhostIconButton } from "../button"

interface ThemeToggleProps {
  className?: string
  theme?: string
  onThemeToggle?: () => void
}

export const ThemeToggle = ({ 
  className = "", 
  theme = "light",
  onThemeToggle 
}: ThemeToggleProps) => {
  const handleThemeToggle = () => {
    onThemeToggle?.()
  }

  return (
    <SecondaryGhostIconButton onClick={handleThemeToggle} className={className}>
      {theme === "dark" ? <SunFilled /> : <Sun />}
    </SecondaryGhostIconButton>
  )
}
