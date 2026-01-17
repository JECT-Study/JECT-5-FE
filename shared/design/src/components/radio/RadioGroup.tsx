"use client"

import { RadioGroup as RadixRadioGroup } from "radix-ui"
import type { ComponentPropsWithoutRef } from "react"

import { cn } from "../../utils/cn"

export type RadioGroupProps = ComponentPropsWithoutRef<
  typeof RadixRadioGroup.Root
>

export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadixRadioGroup.Root
      className={cn("flex flex-col gap-24", className)}
      {...props}
    />
  )
}
