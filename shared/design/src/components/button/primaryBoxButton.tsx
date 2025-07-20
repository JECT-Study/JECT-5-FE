import { cva, type VariantProps } from "class-variance-authority"
import { type ElementRef, forwardRef } from "react"

import { cn } from "../../utils/cn"
import { BaseButton, type BaseButtonProps } from "./baseButton"

const primaryBoxButtonVariants = cva(
  "inline-flex min-h-[39px] shrink-0 flex-row items-center justify-center gap-2.5 rounded-[12px] disabled:cursor-not-allowed disabled:border-none disabled:bg-background-interactive-primary-disabled disabled:text-text-interactive-inverse [&>svg]:shrink-0",
  {
    variants: {
      size: {
        xs: "typography-body-lg-semibold h-[39px] w-fit p-[10px]",
        sm: "typography-heading-sm-semibold h-[42px] w-fit gap-[2px] p-[9px_18px]",
        md: "typography-heading-md-semibold h-[44px] w-fit p-[8px_16px]",
        lg: "typography-heading-lg-semibold h-[52px] w-fit p-[9px_20px]",
        xl: "typography-heading-md-semibold h-[68px] w-[452px] p-[9px_24px]",
        "2xl":
          "typography-heading-3xl-semibold h-[95px] w-[572px] p-[10px_30px]",
      },
      _style: {
        solid:
          "bg-background-interactive-primary text-text-interactive-inverse hover:bg-background-interactive-primary-hovered active:bg-background-interactive-primary-pressed",
        outline:
          "border border-border-interactive-primary text-text-interactive-primary hover:bg-background-interactive-secondary-hovered active:border-0 active:bg-background-interactive-primary-pressed active:text-text-interactive-inverse",
      },
    },
    compoundVariants: [
      {
        size: "sm",
        className: "[&>svg]:mr-[2px] [&>svg]:size-8",
      },
    ],
    defaultVariants: {
      size: "md",
      _style: "solid",
    },
  },
)

export type PrimaryBoxButtonVariantProps = VariantProps<
  typeof primaryBoxButtonVariants
>

interface PrimaryBoxButtonProps
  extends BaseButtonProps,
    PrimaryBoxButtonVariantProps {
  children: React.ReactNode
}

export const PrimaryBoxButton = forwardRef<
  ElementRef<typeof BaseButton>,
  PrimaryBoxButtonProps
>(({ size, _style, className, children, ...props }, ref) => {
  return (
    <BaseButton
      ref={ref}
      className={cn(primaryBoxButtonVariants({ size, _style }), className)}
      {...props}
    >
      {children}
    </BaseButton>
  )
})

PrimaryBoxButton.displayName = "PrimaryBoxButton"
