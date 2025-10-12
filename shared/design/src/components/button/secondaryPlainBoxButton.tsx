import { type ElementRef, forwardRef } from "react"

import { cn } from "../../utils/cn"
import { BaseButton, type BaseButtonProps } from "./baseButton"

export const SecondaryPlainBoxButton = forwardRef<
  ElementRef<typeof BaseButton>,
  BaseButtonProps
>(({ children, className, ...props }, ref) => {
  return (
    <BaseButton
      ref={ref}
      className={cn(
        "typography-body-lg-semibold inline-flex h-[39px] w-fit flex-col items-center justify-center p-8 text-text-interactive-secondary disabled:cursor-not-allowed disabled:text-text-interactive-tertiary",
        className,
      )}
      {...props}
    >
      {children}
    </BaseButton>
  )
})
