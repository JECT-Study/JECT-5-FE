import type { ComponentProps, ReactNode } from "react"

import {
  Dialog,
  DialogBody,
  DialogButton,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./index"

interface CustomDialogProps {
  open?: ComponentProps<typeof Dialog>["open"]
  onOpenChange?: ComponentProps<typeof Dialog>["onOpenChange"]
  variant?: "title" | "onlyTitle" | "onlyBody"
  trigger?: ReactNode
  title?: ReactNode
  description?: ReactNode
  onConfirm?: ComponentProps<typeof DialogClose>["onClick"]
  onCancel?: ComponentProps<typeof DialogClose>["onClick"]
  confirmText?: string
  cancelText?: string
  children?: ReactNode
}

export function CustomDialog({
  open,
  onOpenChange,
  variant = "title",
  trigger,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
  children,
}: CustomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        {(variant === "title" || variant === "onlyTitle") && title && (
          <DialogHeader>{title}</DialogHeader>
        )}
        {(variant === "title" || variant === "onlyBody") && description && (
          <DialogBody>{description}</DialogBody>
        )}
        <DialogFooter variant={variant}>
          {onCancel && (
            <DialogClose asChild>
              <DialogButton.Secondary asChild>
                <button type="button" onClick={onCancel}>
                  {cancelText}
                </button>
              </DialogButton.Secondary>
            </DialogClose>
          )}
          {onConfirm && (
            <DialogClose asChild>
              <DialogButton.Primary asChild>
                <button type="button" onClick={onConfirm}>
                  {confirmText}
                </button>
              </DialogButton.Primary>
            </DialogClose>
          )}
        </DialogFooter>
        {children}
      </DialogContent>
    </Dialog>
  )
}
