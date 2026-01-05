"use client"

import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { type ComponentPropsWithoutRef, forwardRef, useId } from "react"

import { Check } from "../../icons"
import { cn } from "../../utils/cn"

type CheckBoxStateVariant = {
  checked: boolean
  disabled: boolean
}

const getBoxClassName = ({ checked, disabled }: CheckBoxStateVariant) => {
  if (checked && disabled) return "bg-icon-interactive-tertiary"
  if (checked && !disabled) return "bg-icon-primary"
  if (!checked && disabled)
    return "border-2 border-border-interactive-secondary bg-icon-interactive-tertiary"
  return "border-2 border-border-interactive-secondary bg-background-primary"
}

function CheckIndicator({
  checked,
  disabled,
}: {
  checked: boolean
  disabled: boolean
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-[22px] items-center justify-center rounded-[2.75px]",
        getBoxClassName({ checked, disabled }),
      )}
    >
      <Check
        size={16}
        className={cn(
          "text-icon-interactive-inverse transition-opacity",
          checked ? "opacity-100" : "opacity-0",
        )}
      />
    </span>
  )
}

export interface CheckboxProps
  extends Omit<
    ComponentPropsWithoutRef<"input">,
    "type" | "checked" | "defaultChecked" | "onChange"
  > {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  containerClassName?: string
  children?: React.ReactNode
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id: idProp,
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
      disabled = false,
      className,
      containerClassName,
      children,
      ...props
    },
    ref,
  ) => {
    const reactId = useId()
    const id = idProp ?? `check-box-${reactId}`

    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
    })

    return (
      <label
        htmlFor={id}
        className={cn(
          "inline-flex items-center gap-[11px]",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          containerClassName,
        )}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={cn("peer sr-only", className)}
          disabled={disabled}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          {...props}
        />

        <CheckIndicator checked={checked} disabled={disabled} />

        {children}
      </label>
    )
  },
)

Checkbox.displayName = "Checkbox"
