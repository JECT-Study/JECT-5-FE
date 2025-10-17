import { SecondaryGhostIconButton } from "@ject-5-fe/design/components/button"
import { ArrowLeft, ArrowRight } from "@ject-5-fe/design/icons"
import { cn } from "@ject-5-fe/design/utils/cn"

interface QuestionNavigationButtonProps {
  direction: "prev" | "next"
  onClick: () => void
  disabled?: boolean
  className?: string
}

export const QuestionNavigationButton = ({
  direction,
  onClick,
  disabled = false,
  className,
}: QuestionNavigationButtonProps) => {
  return (
    <SecondaryGhostIconButton
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "size-92 rounded-full bg-background-thumbnail-tertiary",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      aria-label={direction === "prev" ? "이전 문제" : "다음 문제"}
    >
      {direction === "prev" ? (
        <ArrowLeft size={40} />
      ) : (
        <ArrowRight size={40} />
      )}
    </SecondaryGhostIconButton>
  )
}
