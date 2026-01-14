import { cn } from "../../utils/cn"

interface RadioIndicatorProps {
  checked: boolean
  disabled?: boolean
}

export function RadioIndicator({ checked, disabled }: RadioIndicatorProps) {
  const showActiveVisual = !disabled && !checked

  const ringClassName = checked
    ? disabled
      ? "border-border-interactive-secondary"
      : "border-icon-primary"
    : cn(
        "border-border-interactive-secondary",
        showActiveVisual
          ? "group-active:border-icon-interactive-primary"
          : null,
      )

  const backgroundClassName = checked
    ? "bg-icon-interactive-inverse"
    : disabled
      ? "bg-icon-interactive-tertiary"
      : "bg-icon-interactive-inverse"

  const dotClassName = checked
    ? disabled
      ? "bg-border-interactive-secondary"
      : "bg-icon-primary"
    : "bg-transparent"

  return (
    <span className="relative grid place-items-center" aria-hidden="true">
      {showActiveVisual && (
        <>
          <span className="absolute size-[25px] rounded-full bg-background-thumbnail-tertiary opacity-0 transition-opacity group-active:opacity-100" />
          <span className="absolute size-[19px] rounded-full border-[1.188px] border-icon-interactive-primary opacity-0 transition-opacity group-active:opacity-100" />
        </>
      )}

      <span
        className={cn(
          "grid size-[19px] place-items-center rounded-full border",
          ringClassName,
          backgroundClassName,
        )}
      >
        <span className={cn("size-[9.5px] rounded-full", dotClassName)} />
      </span>
    </span>
  )
}
