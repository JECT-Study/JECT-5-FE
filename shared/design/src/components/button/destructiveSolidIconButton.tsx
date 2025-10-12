import { cva, type VariantProps } from "class-variance-authority"
import { type ElementRef, forwardRef } from "react"

import { cn } from "../../utils/cn"
import { BaseButton, type BaseButtonProps } from "./baseButton"

const destructiveSolidIconButtonVariants = cva(
  "inline-flex shrink-0 flex-row items-center justify-center rounded-8 bg-background-interactive-destructive text-icon-interactive-inverse hover:bg-background-interactive-destructive-hovered active:bg-background-interactive-destructive-pressed disabled:cursor-not-allowed disabled:bg-background-interactive-destructive-disabled",
  {
    variants: {
      size: {
        md: "size-[36px] p-8",
        lg: "size-[48px] p-12",
      },
    },
    defaultVariants: {
      size: "md" as const,
    },
  },
)

export type DestructiveSolidIconButtonVariantProps = VariantProps<
  typeof destructiveSolidIconButtonVariants
>

interface DestructiveSolidIconButtonProps
  extends BaseButtonProps,
    DestructiveSolidIconButtonVariantProps {
  children: React.ReactNode
}

export const DestructiveSolidIconButton = forwardRef<
  ElementRef<typeof BaseButton>,
  DestructiveSolidIconButtonProps
>(({ size, className, children, ...props }, ref) => {
  return (
    <BaseButton
      ref={ref}
      className={cn(destructiveSolidIconButtonVariants({ size }), className)}
      {...props}
    >
      {children}
    </BaseButton>
  )
})

DestructiveSolidIconButton.displayName = "DestructiveSolidIconButton"
