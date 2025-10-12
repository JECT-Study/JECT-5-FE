import { cva, type VariantProps } from "class-variance-authority"
import { DropdownMenu } from "radix-ui"
import type { ComponentPropsWithoutRef } from "react"
import { forwardRef } from "react"

import { cn } from "../../utils/cn"

const menuVariants = cva(
  "typography-body-md-regular inline-flex rounded-4 bg-background-interactive-primary-sub shadow-[0px_4px_28px_0px_rgba(0,0,0,0.30)]",
  {
    variants: {
      type: {
        vertical: "w-[158px] flex-col items-start",
        horizontal: "min-h-[64px] flex-row items-center",
      },
      contentType: {
        text: "px-12 py-8",
        icon: "px-24 py-12",
      },
    },
    compoundVariants: [
      {
        type: "vertical",
        contentType: "text",
        className: "gap-8",
      },
      {
        type: "horizontal",
        contentType: "icon",
        className: "gap-36",
      },
    ],
    defaultVariants: {
      type: "vertical" as const,
      contentType: "text" as const,
    },
  },
)

const menuItemVariants = cva(
  "typography-body-md-regular flex h-fit shrink-0 items-center justify-start rounded-none text-left text-text-interactive-secondary outline-none hover:text-text-interactive-secondary-hovered hover:outline-none focus:outline-none focus-visible:outline-none active:text-text-interactive-secondary-pressed data-[highlighted]:outline-none",
  {
    variants: {
      type: {
        icon: "h-full w-[49px] flex-col items-center gap-8 p-0 [&>svg]:size-16",
        text: "min-h-[24px] w-full flex-row",
      },
    },
    defaultVariants: {
      type: "text" as const,
    },
  },
)

type MenuType = VariantProps<typeof menuVariants>
type MenuItemType = VariantProps<typeof menuItemVariants>

const DropdownMenuRoot = DropdownMenu.Root

const DropdownMenuTrigger = DropdownMenu.Trigger

const DropdownMenuContent = forwardRef<
  React.ElementRef<typeof DropdownMenu.Content>,
  ComponentPropsWithoutRef<typeof DropdownMenu.Content> & MenuType
>(
  (
    { className, type = "vertical", contentType, sideOffset = 4, ...props },
    ref,
  ) => {
    return (
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          ref={ref}
          className={cn(
            menuVariants({ type, contentType }),
            "max-h-[var(--radix-dropdown-menu-content-available-height)]",
            "origin-[--radix-dropdown-menu-content-transform-origin]",
            className,
          )}
          sideOffset={sideOffset}
          {...props}
        />
      </DropdownMenu.Portal>
    )
  },
)
DropdownMenuContent.displayName = DropdownMenu.Content.displayName

const DropdownMenuItem = forwardRef<
  React.ElementRef<typeof DropdownMenu.Item>,
  ComponentPropsWithoutRef<typeof DropdownMenu.Item> & MenuItemType
>(({ className, type = "text", ...props }, ref) => {
  return (
    <DropdownMenu.Item
      ref={ref}
      className={cn(menuItemVariants({ type }), className)}
      {...props}
    />
  )
})
DropdownMenuItem.displayName = DropdownMenu.Item.displayName

export {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  menuItemVariants,
  menuVariants,
}
