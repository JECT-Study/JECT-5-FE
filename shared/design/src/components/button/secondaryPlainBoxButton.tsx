import { forwardRef } from "react"

import { cn } from "../../utils/cn"
import { BaseButton, type BaseButtonProps } from "./baseButton"

export const SecondaryPlainBoxButton = forwardRef<
  HTMLButtonElement,
  BaseButtonProps
>(({ children, className, ...props }, ref) => {
  return (
    <BaseButton
      ref={ref}
      className={cn(
        "typography-body-lg-semibold inline-flex w-[120px] flex-col items-center justify-center gap-2.5 p-[10px] text-text-interactive-secondary disabled:cursor-not-allowed disabled:text-text-interactive-tertiary",
        className,
      )}
      {...props}
    >
      {children}
    </BaseButton>
  )
})
