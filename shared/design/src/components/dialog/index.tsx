import { cva } from "class-variance-authority"
import { Dialog as DialogPrimitive } from "radix-ui"
import { type ComponentProps, forwardRef } from "react"

import { cn } from "../../utils/cn"
import { PrimaryBoxButton } from "../button/primaryBoxButton"
import { SecondaryPlainBoxButton } from "../button/secondaryPlainBoxButton"

const spacer = cva("", {
  variants: {
    style: {
      title: "h-[27px]",
      onlyTitle: "h-[27px]",
      onlyBody: "h-[15px]",
    },
  },
  defaultVariants: {
    style: "title",
  },
})

export const Dialog = DialogPrimitive.Root

export const DialogTrigger = DialogPrimitive.Trigger

export const DialogClose = DialogPrimitive.Close

//TODO: 애니메이션 적용
export const DialogOverlay = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-neutral-dim70", className)}
    {...props}
  />
))

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

export const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      {...props}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 flex w-[322px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center bg-background-interactive-primary-sub p-5",
        className,
      )}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

export const DialogHeader = ({
  className,
  children,
  ...props
}: ComponentProps<"div">) => (
  <>
    <DialogPrimitive.Title
      className={cn(
        "typography-heading-md-semibold flex w-full flex-col items-center justify-center p-2.5 text-center text-text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  </>
)
DialogHeader.displayName = "DialogHeader"

export const DialogBody = ({ className, ...props }: ComponentProps<"div">) => (
  <>
    <DialogPrimitive.Description
      className={cn(
        "typography-body-lg-medium flex w-full flex-col items-center justify-center p-2.5 text-center text-text-secondary",
        className,
      )}
      {...props}
    />
  </>
)
DialogBody.displayName = "DialogBody"

export const DialogFooter = ({
  className,
  variant = "title",
  ...props
}: ComponentProps<"div"> & {
  variant?: "title" | "onlyTitle" | "onlyBody"
}) => (
  <>
    <div className={spacer({ style: variant })} />
    <div
      className={cn(
        "flex w-full flex-1 items-center justify-center *:flex-1",
        className,
      )}
      {...props}
    />
  </>
)
DialogFooter.displayName = "DialogFooter"

export const DialogButton = {
  Primary: ({
    children,
    ...props
  }: ComponentProps<typeof PrimaryBoxButton>) => (
    <PrimaryBoxButton size="xs" _style="solid" {...props}>
      {children}
    </PrimaryBoxButton>
  ),
  Secondary: ({
    children,
    ...props
  }: ComponentProps<typeof SecondaryPlainBoxButton>) => (
    <SecondaryPlainBoxButton {...props}>{children}</SecondaryPlainBoxButton>
  ),
}

export { CustomDialog } from "./customDialog"
