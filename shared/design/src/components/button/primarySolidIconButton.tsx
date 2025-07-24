import { cva, type VariantProps } from "class-variance-authority"
import { type ElementRef, forwardRef } from "react"

import { cn } from "../../utils/cn"
import { BaseButton, type BaseButtonProps } from "./baseButton"

const primarySolidIconButtonVariants = cva(
  "inline-flex size-9 shrink-0 flex-row items-center justify-center gap-2.5 rounded-lg bg-background-interactive-primary p-1.5 text-icon-interactive-inverse hover:bg-background-interactive-primary-hovered active:bg-background-interactive-primary-pressed disabled:cursor-not-allowed disabled:bg-background-interactive-primary-disabled",
  {
    variants: {},
    defaultVariants: {},
  },
)

type PrimarySolidIconButtonVariantProps = VariantProps<
  typeof primarySolidIconButtonVariants
>

interface PrimarySolidIconButtonProps
  extends BaseButtonProps,
    PrimarySolidIconButtonVariantProps {
  children: React.ReactNode
}

export const PrimarySolidIconButton = forwardRef<
  ElementRef<typeof BaseButton>,
  PrimarySolidIconButtonProps
>(({ className, children, ...props }, ref) => {
  return (
    <BaseButton
      ref={ref}
      className={cn(primarySolidIconButtonVariants(), className)}
      {...props}
    >
      {children}
    </BaseButton>
  )
})

PrimarySolidIconButton.displayName = "PrimarySolidIconButton"
