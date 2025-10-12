import { cva, type VariantProps } from "class-variance-authority"
import { type ElementRef, forwardRef } from "react"

import { cn } from "../../utils/cn"
import { BaseButton, type BaseButtonProps } from "./baseButton"

const primaryBoxButtonVariants = cva(
  "inline-flex min-h-[39px] shrink-0 flex-row items-center justify-center gap-8 rounded-12 disabled:cursor-not-allowed disabled:border-none disabled:bg-background-interactive-primary-disabled disabled:text-text-interactive-inverse [&>svg]:shrink-0",
  {
    variants: {
      size: {
        xs: "typography-body-lg-semibold h-[35px] w-fit p-8",
        sm: "typography-heading-sm-semibold h-[40px] w-fit gap-4 px-16 py-8",
        md: "typography-heading-md-semibold h-[44px] w-fit px-16 py-8",
        lg: "typography-heading-lg-semibold h-[50px] w-fit px-20 py-8",
        xl: "typography-heading-lg-semibold h-[68px] w-[452px] px-24 py-8",
        "2xl": "typography-heading-3xl-semibold h-[82px] w-[572px] px-32 py-12",
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
        className: "[&>svg]:size-24",
      },
      {
        size: "lg",
        className: "[&>svg]:size-24",
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
