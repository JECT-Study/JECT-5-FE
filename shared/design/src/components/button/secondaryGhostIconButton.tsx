import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef } from "react"

import { cn } from "../../utils/cn"
import { BaseButton, type BaseButtonProps } from "./baseButton"

const secondaryGhostIconButtonVariants = cva(
  "inline-flex size-11 shrink-0 flex-row items-center justify-center gap-2.5 rounded-lg p-2.5 hover:bg-background-interactive-secondary-hovered active:bg-background-interactive-secondary-pressed disabled:bg-background-interactive-secondary-pressed",
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
  HTMLButtonElement,
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
