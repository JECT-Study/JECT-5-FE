"use client"

import { RadioGroup as RadixRadioGroup } from "radix-ui"
import { type ComponentPropsWithoutRef, forwardRef } from "react"

import { cn } from "../../utils/cn"

//기존의 value 관련 타입을 string -> T로 확장
export type RadioItemProps<T extends string = string> = Omit<
  ComponentPropsWithoutRef<typeof RadixRadioGroup.Item>,
  "value" | "children"
> & {
  children?: React.ReactNode
  value: T
}

export const RadioItem = forwardRef<HTMLButtonElement, RadioItemProps>(
  ({ className, children, disabled, ...props }, ref) => {
    return (
      <RadixRadioGroup.Item
        ref={ref}
        disabled={disabled}
        className={cn(
          "group inline-flex items-center gap-8",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          className,
        )}
        {...props}
      >
        <span className="relative grid place-items-center" aria-hidden="true">
          {!disabled && (
            <>
              <span className="absolute size-[25px] rounded-full bg-background-thumbnail-tertiary opacity-0 transition-opacity group-active:opacity-100 data-[state=checked]:hidden" />
              <span className="absolute size-[19px] rounded-full border-[1.188px] border-icon-interactive-primary opacity-0 transition-opacity group-active:opacity-100 data-[state=checked]:hidden" />
            </>
          )}

          <span
            className={cn(
              "grid size-[19px] place-items-center rounded-full border bg-icon-interactive-inverse",
              disabled
                ? "border-border-interactive-secondary"
                : "border-border-interactive-secondary group-active:border-icon-interactive-primary",
              "data-[state=checked]:border-icon-primary",
              disabled &&
                "data-[state=checked]:border-border-interactive-secondary",
            )}
          >
            <RadixRadioGroup.Indicator asChild>
              <span
                className={cn(
                  "size-[9.5px] rounded-full",
                  disabled
                    ? "bg-border-interactive-secondary"
                    : "bg-icon-primary",
                )}
              />
            </RadixRadioGroup.Indicator>
          </span>
        </span>

        {children}
      </RadixRadioGroup.Item>
    )
  },
)

RadioItem.displayName = "RadioItem"
