import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef } from "react"

import { cn } from "../../utils/cn"
import { BaseButton, type BaseButtonProps } from "./baseButton"

const destructiveBoxButtonVariants = cva(
  "inline-flex flex-row items-center justify-center gap-2.5 rounded-xl disabled:cursor-not-allowed",
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
          "bg-background-interactive-destructive text-text-interactive-inverse hover:bg-background-interactive-destructive-hovered active:bg-background-interactive-destructive-pressed disabled:bg-background-interactive-destructive-disabled",
      },
    },
    compoundVariants: [
      {
        size: "sm" as const,
        className: "[&>svg]:gap-[2px]",
      },
    ],
  },
)

export type DestructiveBoxButtonVariantProps = VariantProps<
  typeof destructiveBoxButtonVariants
>

interface DestructiveBoxButtonProps
  extends BaseButtonProps,
    DestructiveBoxButtonVariantProps {
  children: React.ReactNode
}

export const DestructiveSolidBoxButton = forwardRef<
  HTMLButtonElement,
  DestructiveBoxButtonProps
>(({ size, _style = "solid", className, children, ...props }, ref) => {
  return (
    <BaseButton
      ref={ref}
      className={cn(destructiveBoxButtonVariants({ size, _style }), className)}
      {...props}
    >
      {children}
    </BaseButton>
  )
})

DestructiveSolidBoxButton.displayName = "DestructiveSolidBoxButton"
