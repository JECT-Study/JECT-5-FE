import { cva, type VariantProps } from "class-variance-authority"
import React, { type ElementRef } from "react"

import { cn } from "../../utils/cn"
import { BaseButton, type BaseButtonProps } from "./baseButton"

const secondaryPlainIconButtonVariants = cva(
  "inline-flex items-center justify-center text-icon-interactive-secondary transition-colors hover:text-icon-interactive-secondary-hovered active:text-icon-interactive-secondary-pressed disabled:cursor-not-allowed disabled:text-icon-interactive-secondary-disabled",
  {
    variants: {
      size: {
        sm: "size-6 [&>svg]:size-6",
        md: "size-7 [&>svg]:size-7",
        lg: "size-8 [&>svg]:size-8",
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
  ElementRef<typeof BaseButton>,
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
