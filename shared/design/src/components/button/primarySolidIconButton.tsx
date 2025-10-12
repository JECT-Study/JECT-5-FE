import { cva, type VariantProps } from "class-variance-authority"
import { type ElementRef, forwardRef } from "react"

import { cn } from "../../utils/cn"
import { BaseButton, type BaseButtonProps } from "./baseButton"

const primarySolidIconButtonVariants = cva(
  "inline-flex size-40 shrink-0 flex-row items-center justify-center rounded-8 bg-background-interactive-primary p-8 text-icon-interactive-inverse hover:bg-background-interactive-primary-hovered active:bg-background-interactive-primary-pressed disabled:cursor-not-allowed disabled:bg-background-interactive-primary-disabled [&>svg]:size-24",
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
