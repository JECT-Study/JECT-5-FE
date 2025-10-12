import { cva, type VariantProps } from "class-variance-authority"
import { type ElementRef, forwardRef } from "react"

import { cn } from "../../utils/cn"
import { BaseButton, type BaseButtonProps } from "./baseButton"

const secondaryGhostIconButtonVariants = cva(
  "inline-flex size-48 shrink-0 flex-row items-center justify-center rounded-8 p-12 hover:bg-background-interactive-secondary-hovered active:bg-background-interactive-secondary-pressed disabled:bg-background-interactive-secondary-pressed [&>svg]:size-24",
  {
    variants: {},
    defaultVariants: {},
  },
)

export type SecondaryGhostIconButtonVariantProps = VariantProps<
  typeof secondaryGhostIconButtonVariants
>

interface SecondaryGhostIconButtonProps
  extends BaseButtonProps,
    SecondaryGhostIconButtonVariantProps {
  children: React.ReactNode
}

export const SecondaryGhostIconButton = forwardRef<
  ElementRef<typeof BaseButton>,
  SecondaryGhostIconButtonProps
>(({ className, children, ...props }, ref) => {
  return (
    <BaseButton
      ref={ref}
      className={cn(secondaryGhostIconButtonVariants(), className)}
      {...props}
    >
      {children}
    </BaseButton>
  )
})

SecondaryGhostIconButton.displayName = "SecondaryGhostIconButton"

export { secondaryGhostIconButtonVariants }
