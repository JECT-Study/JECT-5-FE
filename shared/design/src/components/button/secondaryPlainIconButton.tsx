import { cva, type VariantProps } from "class-variance-authority"
import React from "react"

import { cn } from "../../utils/cn"
import { BaseButton, type BaseButtonProps } from "./baseButton"

const secondaryPlainIconButtonVariants = cva(
  "inline-flex items-center justify-center text-icon-interactive-secondary transition-colors hover:text-icon-interactive-secondary-hovered active:text-icon-interactive-secondary-pressed disabled:cursor-not-allowed disabled:text-icon-interactive-secondary-disabled",
  {
    variants: {
      size: {
        sm: "size-6", // 24×24px
        md: "size-7 rounded-lg", // 28×28px with 8px radius
        lg: "size-8", // 32×32px
      },
    },
    defaultVariants: {
      size: "md" as const,
    },
  },
)

export interface SecondaryPlainIconButtonProps
  extends BaseButtonProps,
    VariantProps<typeof secondaryPlainIconButtonVariants> {}

const SecondaryPlainIconButton = React.forwardRef<
  HTMLButtonElement,
  SecondaryPlainIconButtonProps
>(({ className, size, ...props }, ref) => {
  return (
    <BaseButton
      className={cn(secondaryPlainIconButtonVariants({ size }), className)}
      ref={ref}
      {...props}
    />
  )
})

SecondaryPlainIconButton.displayName = "SecondaryPlainIconButton"

export { SecondaryPlainIconButton, secondaryPlainIconButtonVariants }
