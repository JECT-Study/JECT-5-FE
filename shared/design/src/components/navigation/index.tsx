"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef } from "react"

import { cn } from "../../utils/cn"

const navigationVariants = cva(
  "flex h-[110px] w-full items-center justify-between bg-background-tertiary",
  {
    variants: {
      type: {
        untitle: "",
        title: "",
        searchbar: "",
        createGame: "bg-background-tertiary",
        startGame: "bg-background-tertiary",
        progressbar: "",
        onGame: "",
      },
    },
    defaultVariants: {
      type: "untitle",
    },
  },
)

const leftSectionVariants = cva("flex w-[420px] items-center gap-2.5 px-10", {
  variants: {
    type: {
      untitle: "",
      title: "",
      searchbar: "",
      createGame: "",
      startGame: "",
      progressbar: "",
      onGame: "",
    },
  },
  defaultVariants: {
    type: "untitle",
  },
})

const centerSectionVariants = cva("flex items-center", {
  variants: {
    type: {
      untitle: "hidden",
      title: "flex w-[1080px] justify-center",
      searchbar: "flex h-[64px] w-[871px]",
      createGame: "hidden",
      startGame: "flex w-[1080px] justify-center",
      progressbar: "flex w-[1080px] justify-center",
      onGame: "flex w-[1080px] justify-center",
    },
  },
  defaultVariants: {
    type: "untitle",
  },
})

const rightSectionVariants = cva(
  "flex w-[420px] flex-col items-end justify-center gap-2.5",
  {
    variants: {
      type: {
        untitle: "",
        title: "",
        searchbar: "",
        createGame: "",
        startGame: "",
        progressbar: "",
        onGame: "",
      },
    },
    defaultVariants: {
      type: "untitle",
    },
  },
)

const rightContainerVariants = cva("flex items-center gap-4 px-10", {
  variants: {
    type: {
      untitle: "h-[48px]",
      title: "h-[44px]",
      searchbar: "h-[48px]",
      createGame: "h-[44px]",
      startGame: "h-[44px]",
      progressbar: "h-[44px]",
      onGame: "h-[44px]",
    },
  },
  defaultVariants: {
    type: "untitle",
  },
})

export type NavigationVariantProps = VariantProps<typeof navigationVariants>

interface NavigationProps extends NavigationVariantProps {
  className?: string
  leftContent?: React.ReactNode
  centerContent?: React.ReactNode
  rightContent?: React.ReactNode
  "aria-label"?: string
}

export const Navigation = forwardRef<HTMLElement, NavigationProps>(
  (
    {
      className,
      type,
      leftContent,
      centerContent,
      rightContent,
      "aria-label": ariaLabel,
    },
    ref,
  ) => {
    return (
      <nav
        ref={ref}
        className={cn(navigationVariants({ type }), className)}
        role="navigation"
        aria-label={ariaLabel}
        data-testid="navigation"
      >
        {/* Left Section */}
        <div
          className={cn(leftSectionVariants({ type }))}
          role="banner"
          aria-label="왼쪽 섹션"
        >
          {leftContent}
        </div>

        {/* Center Section */}
        <div
          className={cn(centerSectionVariants({ type }))}
          role="main"
          aria-label="중앙 섹션"
        >
          {centerContent}
        </div>

        {/* Right Section */}
        <div
          className={cn(rightSectionVariants({ type }))}
          role="complementary"
          aria-label="오른쪽 섹션"
        >
          <div className={cn(rightContainerVariants({ type }))}>
            {rightContent}
          </div>
        </div>
      </nav>
    )
  },
)

Navigation.displayName = "Navigation"
