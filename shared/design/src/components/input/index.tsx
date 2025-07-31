"use client"

import { cva } from "class-variance-authority"
import { Form } from "radix-ui"
import { Context, useControllableState } from "radix-ui/internal"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { forwardRef } from "react"

import { Magnifier, Trash } from "../../icons"
import { cn } from "../../utils/cn"
import { DestructiveSolidIconButton } from "../button/destructiveSolidIconButton"

type InputVariant = {
  type: "leftIcon" | "noIcon" | "labelOn" | "reset"
  state: "default" | "error"
}

const baseVariants = cva("flex flex-col items-start", {
  variants: {
    type: {
      leftIcon: "h-[64px] w-[871px]",
      noIcon: "w-[320px]",
      labelOn: "w-[452px] space-y-6",
      reset: "w-[452px]",
    },
    state: {
      default: "",
      error: "space-y-2.5",
    },
  },
})

const labelVariants = cva("typography-heading-sm-semibold text-text-primary")

const inputWrapperVariants = cva(
  "flex w-full shrink-0 items-center gap-2 rounded-[5px] border",
  {
    variants: {
      type: {
        leftIcon: "h-full px-[20px]",
        noIcon: "p-[12px_14px]",
        labelOn: "p-[20px]",
        reset: "p-[20px]",
      },
      state: {
        default:
          "border-border-interactive-input-default focus-within:rounded-[5px] focus-within:border-2 focus-within:border-border-interactive-input-focused",
        error:
          "border-border-interactive-input-error focus-within:border-2 focus-within:border-border-interactive-input-error",
      },
    },
    defaultVariants: {
      state: "default" as const,
    },
  },
)

const inputVariants = cva(
  "flex-1 gap-2 placeholder:text-text-interactive-input-placeholder focus:outline-none",
  {
    variants: {
      type: {
        leftIcon: "typography-heading-sm-medium",
        noIcon: "typography-heading-sm-semibold",
        labelOn: "typography-heading-sm-medium",
        reset: "typography-heading-sm-medium",
      },
    },
  },
)

const iconVariants = cva("", {
  variants: {
    type: {
      leftIcon: "size-4",
      reset: "size-7",
    },
  },
})

const errorTextVariants = cva(
  "typography-body-sm-medium mt-[10px] text-text-interactive-input-error",
)

export const Root = Form.Root

type InputContext = {
  name: string
  children: ReactNode
} & InputVariant

const [InputProvider, useInputContext] =
  Context.createContext<InputContext>("textField")

export const Field = forwardRef<
  React.ElementRef<typeof Form.Field>,
  ComponentPropsWithoutRef<typeof Form.Field> & InputVariant
>(({ className, name, type, state, children, ...props }, ref) => {
  return (
    <InputProvider name={name} type={type} state={state}>
      <Form.Field
        ref={ref}
        name={name}
        className={cn(baseVariants({ type, state }), className)}
        {...props}
      >
        {children}
      </Form.Field>
    </InputProvider>
  )
})
Field.displayName = Form.Field.displayName

export const Label = forwardRef<
  React.ElementRef<typeof Form.Label>,
  ComponentPropsWithoutRef<typeof Form.Label> & { children: ReactNode }
>(({ className, children, ...props }, ref) => {
  return (
    <Form.Label ref={ref} className={cn(labelVariants(), className)} {...props}>
      {children}
    </Form.Label>
  )
})

Label.displayName = Form.Label.displayName

export const Control = forwardRef<
  React.ElementRef<typeof Form.Control>,
  Omit<
    ComponentPropsWithoutRef<typeof Form.Control>,
    "value" | "onChange" | "defaultValue"
  > & {
    value?: string
    onChange?: (value: string) => void
    defaultValue?: string
    onReset?: () => void
  }
>(({ children, value, onChange, defaultValue, onReset, ...props }, ref) => {
  const { type, state } = useInputContext("textField")

  const [controlledValue, setValue] = useControllableState({
    prop: value,
    defaultProp: defaultValue ?? "",
    onChange,
  })

  return (
    <div className={inputWrapperVariants({ type, state })}>
      {type === "leftIcon" && <Magnifier className={iconVariants({ type })} />}
      <Form.Control ref={ref} asChild>
        <input
          className={inputVariants({ type })}
          value={controlledValue}
          onChange={(e) => setValue(e.target.value)}
          {...props}
        />
      </Form.Control>
      {type === "reset" && (
        <DestructiveSolidIconButton
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setValue("")
            onReset?.()
          }}
        >
          <Trash className={iconVariants({ type })} />
        </DestructiveSolidIconButton>
      )}
    </div>
  )
})
Control.displayName = Form.Control.displayName

export const ErrorText = forwardRef<
  React.ElementRef<typeof Form.Message>,
  ComponentPropsWithoutRef<typeof Form.Message>
>(({ className, children, ...props }, ref) => {
  return (
    <Form.Message ref={ref} asChild {...props}>
      <p className={cn(errorTextVariants(), className)}>{children}</p>
    </Form.Message>
  )
})
ErrorText.displayName = Form.Message.displayName
