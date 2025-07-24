import { Slot } from "radix-ui"
import { type ComponentPropsWithoutRef, forwardRef } from "react"

export type BaseButtonProps = ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean
}

export const BaseButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "button"
    return <Comp ref={ref} data-slot="button" {...props} />
  },
)
