import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef } from "react"

import { cn } from "../../utils/cn"
import { BaseButton, type BaseButtonProps } from "./baseButton"

const primaryBoxButtonVariants = cva(
  "inline-flex shrink-0 flex-row items-center justify-center gap-2.5 rounded-[12px] disabled:cursor-not-allowed disabled:border-none disabled:bg-background-interactive-primary-disabled disabled:text-text-interactive-inverse",
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
      // state: {//state 속성은 가상선택자로 구현 - hover,active,disabled
      //   default: "bg-background-interactive-primary" as const,
      //   hovered: "hover:bg-background-interactive-primary-hover" as const,
      //   pressed: "active:bg-background-interactive-primary-pressed" as const,
      //   disabled:
      //     "disabled:bg-background-interactive-primary-disabled" as const,
      // },
    },
    compoundVariants: [
      {
        size: "sm" as const,
        className: "[&>svg]:mr-[2px] [&>svg]:size-8",
      },
    ],
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
  HTMLButtonElement,
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

PrimaryBoxButton.displayName = "BoxButton"
