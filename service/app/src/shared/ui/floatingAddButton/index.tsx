"use client"

import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"
import { Add } from "@ject-5-fe/design/icons"
import { cn } from "@ject-5-fe/design/utils/cn"
import type { ComponentPropsWithoutRef } from "react"

interface FloatingAddButtonProps
  extends Omit<ComponentPropsWithoutRef<typeof PrimaryBoxButton>, "children"> {
  ariaLabel: string
  containerClassName?: string
}

export function FloatingAddButton({
  ariaLabel,
  className,
  containerClassName,
  ...props
}: FloatingAddButtonProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-40 flex flex-col items-center px-32 pb-32 pt-80",
        containerClassName,
      )}
    >
      <div className="absolute inset-x-0 bottom-0 h-[124px] rounded-20 bg-gradient-to-b from-transparent from-0% to-background-tertiary to-[41.35%]" />
      <PrimaryBoxButton
        className={cn(
          "pointer-events-auto relative aspect-square size-64 rounded-full",
          className,
        )}
        aria-label={ariaLabel}
        {...props}
      >
        <Add className="size-full" />
      </PrimaryBoxButton>
    </div>
  )
}
