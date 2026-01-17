"use client"

import { RadioGroup as RadixRadioGroup } from "radix-ui"
import type { ComponentPropsWithoutRef } from "react"

import { cn } from "../../utils/cn"

//기존의 value의 타입을 string -> T로 확장
export type RadioGroupProps<T extends string = string> = Omit<
  ComponentPropsWithoutRef<typeof RadixRadioGroup.Root>,
  "value" | "defaultValue" | "onValueChange"
> & {
  defaultValue?: T
  value?: T | null
  onValueChange?: (value: T) => void
}

export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadixRadioGroup.Root
      className={cn("flex flex-col gap-24", className)}
      {...props}
    />
  )
}
