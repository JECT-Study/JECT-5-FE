import { cva, type VariantProps } from "class-variance-authority"
import { type ElementRef, forwardRef } from "react"

import { cn } from "../../utils/cn"
import { BaseButton, type BaseButtonProps } from "./baseButton"

const secondaryOutlineBoxButtonVariants = cva(
  "inline-flex flex-row items-center justify-center gap-12 rounded-12 border border-border-interactive-secondary bg-background-interactive-inverse text-text-interactive-secondary hover:bg-background-interactive-secondary-hovered active:border-none active:bg-background-interactive-secondary-pressed disabled:cursor-not-allowed disabled:border-none disabled:bg-background-interactive-secondary-pressed [&>svg]:shrink-0",
  {
    variants: {
      size: {
        md: "typography-body-lg-semibold h-[48px] w-fit border-1 px-16 py-8",
        lg: "typography-heading-3xl-semibold h-[98px] w-[572px] border-2 px-32 py-20",
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
  ElementRef<typeof BaseButton>,
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
