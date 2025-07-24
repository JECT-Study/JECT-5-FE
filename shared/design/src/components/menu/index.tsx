import { cva, type VariantProps } from "class-variance-authority"
import { DropdownMenu } from "radix-ui"
import type { ComponentPropsWithoutRef } from "react"
import { forwardRef } from "react"

import { cn } from "../../utils/cn"

const menuVariants = cva(
  "typography-body-md-regular inline-flex rounded-[4px] bg-background-interactive-primary-sub shadow-[0px_4px_28px_0px_rgba(0,0,0,0.30)]",
  {
    variants: {
      type: {
        vertical: "w-[158px] flex-col items-start",
        horizontal: "flex-row items-center",
      },
      contentType: {
        text: "p-[12px_8px]",
        icon: "p-[14px_25px]",
      },
    },
    compoundVariants: [
      {
        type: "vertical",
        contentType: "text",
        className: "gap-2.5",
      },
      {
        type: "horizontal",
        contentType: "icon",
        className: "gap-[35px]",
      },
    ],
    defaultVariants: {
      type: "vertical" as const,
      contentType: "text" as const,
    },
  },
)

const menuItemVariants = cva(
  "typography-body-md-regular flex h-fit shrink-0 items-center justify-start rounded-none text-left text-text-interactive-secondary hover:text-text-interactive-secondary-hovered active:text-text-interactive-secondary-pressed",
  {
    variants: {
      type: {
        icon: "w-[49px] flex-col items-center gap-[9px] p-0 [&>svg]:size-4",
        text: "w-[134px] flex-row gap-[10px] px-1",
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
