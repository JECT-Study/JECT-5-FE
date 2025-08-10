"use client"

import { Progress as ProgressPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "../../utils/cn"

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  max?: number
}

function Progress({
  className,
  value,
  max = 100,
  ...props
}: ProgressProps) {
  const percentage = max > 0 ? ((value || 0) / max) * 100 : 0

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-[25px] w-[1080px] overflow-hidden rounded-[99px] bg-background-progressbar-secondary",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="size-full flex-1 rounded-[99px] bg-background-badge-primary transition-all"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
