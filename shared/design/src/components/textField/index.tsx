"use client"

import { cva } from "class-variance-authority"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react"

import { cn } from "../../utils/cn"

type TextFieldVariant = {
  state?: "default" | "error"
}

const baseVariants = "flex w-full flex-col items-start space-y-5"

const labelVariants = "typography-heading-sm-semibold text-text-primary"

const inputWrapperVariants = cva(
  "flex w-full shrink-0 items-center gap-8 rounded-[8px] border-2 bg-background-interactive-input-primary p-[20px]",
  {
    variants: {
      state: {
        default:
          "border-border-interactive-input-default focus-within:border-border-interactive-input-focused",
        error:
          "border-border-interactive-input-error focus-within:border-border-interactive-input-error",
      },
    },
    defaultVariants: {
      state: "default" as const,
    },
  },
)

const inputVariants =
  "typography-heading-sm-medium flex-1 gap-8 bg-transparent text-text-interactive-input-filled placeholder:text-text-interactive-input-placeholder focus:outline-none"

const errorTextVariants =
  "typography-body-sm-medium -mt-2 text-text-interactive-input-error"

type TextFieldContextValue = {
  name?: string
  state: TextFieldVariant["state"]
  inputId: string
  errorId?: string
  setErrorId: (id: string | undefined) => void
}

const TextFieldContext = createContext<TextFieldContextValue | undefined>(
  undefined,
)

const useTextFieldContext = () => {
  const ctx = useContext(TextFieldContext)
  if (!ctx) {
    throw new Error(
      "TextField.* components must be used within <TextField.Root>",
    )
  }
  return ctx
}

export const Root = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div"> &
    TextFieldVariant & {
      name: string
      inputId?: string
      children: ReactNode
    }
>(
  (
    {
      className,
      name,
      state = "default",
      inputId: inputIdProp,
      children,
      ...props
    },
    ref,
  ) => {
    const reactId = useId()
    const inputId = useMemo(
      () => inputIdProp ?? (name ? `${name}-input` : `text-field-${reactId}`),
      [inputIdProp, name, reactId],
    )

    const [errorId, setErrorId] = useState<string | undefined>(undefined)

    const contextValue = useMemo<TextFieldContextValue>(
      () => ({ name, state, inputId, errorId, setErrorId }),
      [name, state, inputId, errorId],
    )

    return (
      <TextFieldContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(baseVariants, className)}
          role="group"
          {...props}
        >
          {children}
        </div>
      </TextFieldContext.Provider>
    )
  },
)
Root.displayName = "TextField.Root"

export const Label = forwardRef<
  HTMLLabelElement,
  ComponentPropsWithoutRef<"label">
>(({ className, children, htmlFor, ...props }, ref) => {
  const { inputId } = useTextFieldContext()
  return (
    <label
      ref={ref}
      className={cn(labelVariants, className)}
      htmlFor={htmlFor ?? inputId}
      {...props}
    >
      {children}
    </label>
  )
})

Label.displayName = "TextField.Label"

export const InputWrapper = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => {
  const { state } = useTextFieldContext()

  return (
    <div
      ref={ref}
      className={cn(inputWrapperVariants({ state }), className)}
      {...props}
    >
      {children}
    </div>
  )
})
InputWrapper.displayName = "TextField.InputWrapper"

type InputProps = ComponentPropsWithoutRef<"input">
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      id,
      name,
      type = "text",
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const { state, name: ctxName, inputId, errorId } = useTextFieldContext()

    const mergedDescribedBy = useMemo(() => {
      const parts = [ariaDescribedBy]
      if (state === "error" && errorId) parts.push(errorId)
      return parts.filter(Boolean).join(" ") || undefined
    }, [ariaDescribedBy, state, errorId])

    const mergedAriaInvalid =
      ariaInvalid ?? (state === "error" ? true : undefined)

    return (
      <input
        ref={ref}
        className={cn(inputVariants, className)}
        id={id ?? inputId}
        name={name ?? ctxName}
        type={type}
        aria-invalid={mergedAriaInvalid}
        aria-describedby={mergedDescribedBy}
        {...props}
      />
    )
  },
)
Input.displayName = "TextField.Input"

export const LeftAddon = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex size-16 shrink-0 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
LeftAddon.displayName = "TextField.LeftAddon"

export const ErrorText = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<"p"> & { id?: string }
>(({ className, id, children, ...props }, ref) => {
  const { inputId, setErrorId } = useTextFieldContext()
  const resolvedId = id ?? `${inputId}-error`

  useEffect(() => {
    setErrorId(resolvedId)
    return () => setErrorId(undefined)
  }, [resolvedId, setErrorId])

  return (
    <p
      ref={ref}
      id={resolvedId}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={cn(errorTextVariants, className)}
      {...props}
    >
      {children}
    </p>
  )
})
ErrorText.displayName = "TextField.ErrorText"
