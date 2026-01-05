"use client"

import { useControllableState } from "radix-ui/internal"
import { type ComponentPropsWithoutRef, forwardRef, useId } from "react"

import { cn } from "../../utils/cn"

type RadioIndicatorVariant = {
  checked: boolean
  disabled: boolean
}

function RadioIndicator({ checked, disabled }: RadioIndicatorVariant) {
  const showActiveVisual = !disabled && !checked

  const ringClassName = checked
    ? disabled
      ? "border-border-interactive-secondary"
      : "border-icon-primary"
    : cn(
        "border-border-interactive-secondary",
        showActiveVisual
          ? "group-active:border-icon-interactive-primary"
          : null,
      )

  const backgroundClassName = checked
    ? "bg-icon-interactive-inverse"
    : disabled
      ? "bg-icon-interactive-tertiary"
      : "bg-icon-interactive-inverse"

  const dotClassName = checked
    ? disabled
      ? "bg-border-interactive-secondary"
      : "bg-icon-primary"
    : "bg-transparent"

  return (
    <span className="relative grid place-items-center" aria-hidden="true">
      {showActiveVisual ? (
        <>
          <span
            className={cn(
              "absolute size-[25px] rounded-full bg-background-thumbnail-tertiary transition-opacity",
              "opacity-0 group-active:opacity-100",
            )}
          />
          <span
            className={cn(
              "absolute size-[19px] rounded-full border-[1.188px] border-icon-interactive-primary transition-opacity",
              "opacity-0 group-active:opacity-100",
            )}
          />
        </>
      ) : null}

      <span
        className={cn(
          "grid size-[19px] place-items-center rounded-full border",
          ringClassName,
          backgroundClassName,
        )}
      >
        <span className={cn("size-[9.5px] rounded-full", dotClassName)} />
      </span>
    </span>
  )
}

export interface RadioFieldProps
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

export const RadioField = forwardRef<HTMLInputElement, RadioFieldProps>(
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
    const id = idProp ?? `radio-field-${reactId}`

    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
    })

    return (
      <label
        htmlFor={id}
        className={cn(
          "group inline-flex items-center gap-8",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          containerClassName,
        )}
      >
        <input
          ref={ref}
          id={id}
          type="radio"
          className={cn("peer sr-only", className)}
          disabled={disabled}
          checked={checked}
          onChange={(e) => {
            if (e.target.checked) setChecked(true)
          }}
          {...props}
        />

        <RadioIndicator checked={checked} disabled={disabled} />

        {children}
      </label>
    )
  },
)

RadioField.displayName = "RadioField"
