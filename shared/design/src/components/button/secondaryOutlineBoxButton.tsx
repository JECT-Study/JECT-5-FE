import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef } from "react"

import { cn } from "../../utils/cn"
import { BaseButton, type BaseButtonProps } from "./baseButton"

const secondaryOutlineBoxButtonVariants = cva(
  "inline-flex shrink-0 flex-row items-center justify-center gap-2.5 rounded-xl border border-border-interactive-secondary bg-background-interactive-inverse text-text-interactive-secondary hover:bg-background-interactive-secondary-hovered active:border-none active:bg-background-interactive-secondary-pressed disabled:cursor-not-allowed disabled:border-none disabled:bg-background-interactive-secondary-pressed",
  {
    variants: {
      size: {
        md: "typography-body-lg-semibold size-fit border p-[8px_15px]",
        lg: "typography-heading-3xl-semibold h-[95px] w-[572px] border-[3px] p-[10px_30px]",
      },
    },
    defaultVariants: {
      size: "md" as const,
    },
  },
)

export type SecondaryOutlineBoxButtonVariantProps = VariantProps<
  typeof secondaryOutlineBoxButtonVariants
>

interface SecondaryOutlineBoxButtonProps
  extends BaseButtonProps,
    SecondaryOutlineBoxButtonVariantProps {
  children: React.ReactNode
}

export const SecondaryOutlineBoxButton = forwardRef<
  HTMLButtonElement,
  SecondaryOutlineBoxButtonProps
>(({ size, className, children, ...props }, ref) => {
  return (
    <BaseButton
      ref={ref}
      className={cn(secondaryOutlineBoxButtonVariants({ size }), className)}
      {...props}
    >
      {children}
    </BaseButton>
  )
})

SecondaryOutlineBoxButton.displayName = "SecondaryOutlineBoxButton"
