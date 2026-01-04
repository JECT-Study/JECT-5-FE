"use client"

import { type ComponentPropsWithoutRef } from "react"

import { cn } from "../../utils/cn"

interface NavigationProps extends ComponentPropsWithoutRef<"nav"> {
  leftContent?: React.ReactNode
  centerContent?: React.ReactNode
  rightContent?: React.ReactNode
}

export const Navigation = ({
  className,
  leftContent,
  centerContent,
  rightContent,
  ...rest
}: NavigationProps) => {
  return (
    <nav
      className={cn(
        "fixed left-0 top-0 z-50 flex h-[90px] min-h-[90px] w-full items-center justify-between gap-36 bg-background-primary px-40",
        className,
      )}
      {...rest}
    >
      <div className="flex shrink-0 items-center justify-start">
        {leftContent}
      </div>
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
        {centerContent}
      </div>
      <div className="flex shrink-0 items-center justify-end gap-16">
        {rightContent}
      </div>
    </nav>
  )
}
