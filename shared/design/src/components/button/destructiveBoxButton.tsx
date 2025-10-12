import { cva, type VariantProps } from "class-variance-authority"
import { type ElementRef, forwardRef } from "react"

import { cn } from "../../utils/cn"
import { BaseButton, type BaseButtonProps } from "./baseButton"

const destructiveBoxButtonVariants = cva(
  "inline-flex flex-row items-center justify-center gap-8 rounded-xl disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        xs: "typography-body-lg-semibold h-[35px] w-fit p-8",
        sm: "typography-heading-sm-semibold h-[40px] w-fit gap-[2px] px-16 py-8",
        md: "typography-heading-md-semibold h-[44px] w-fit px-16 py-8",
        lg: "typography-heading-lg-semibold h-[50px] w-fit px-20 py-8",
        xl: "typography-heading-md-semibold h-[68px] w-[452px] px-24 py-8",
        "2xl": "typography-heading-3xl-semibold h-[82px] w-[572px] px-32 py-12",
      },
      _style: {
        solid:
          "bg-background-interactive-destructive text-text-interactive-inverse hover:bg-background-interactive-destructive-hovered active:bg-background-interactive-destructive-pressed disabled:bg-background-interactive-destructive-disabled",
      },
    },
    compoundVariants: [
      {
        size: "sm" as const,
        className: "[&>svg]:gap-4",
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
  ElementRef<typeof BaseButton>,
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
