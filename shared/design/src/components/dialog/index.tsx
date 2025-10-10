"use client"
import "./dialog.css"

import { Dialog as DialogPrimitive } from "radix-ui"
import {
  type ComponentProps,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useState,
} from "react"

import { cn } from "../../utils/cn"
import { DestructiveSolidBoxButton } from "../button"
import { PrimaryBoxButton } from "../button/primaryBoxButton"
import { SecondaryPlainBoxButton } from "../button/secondaryPlainBoxButton"

interface DialogA11yContextValue {
  hasHeader: boolean
  hasBody: boolean
  setHasHeader: (hasHeader: boolean) => void
  setHasBody: (hasBody: boolean) => void
}

//Header,Body 존재 여부를 추적하는 컨텍스트
const DialogA11yContext = createContext<DialogA11yContextValue | null>(null)

const useDialogA11y = () => {
  const context = useContext(DialogA11yContext)
  if (!context) {
    throw new Error(
      "useDialogA11y must be used within a DialogContent component",
    )
  }
  return context
}

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
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    role?: "dialog" | "alertdialog"
  }
>(({ className, children, role = "dialog", ...props }, ref) => {
  const [hasHeader, setHasHeader] = useState(false)
  const [hasBody, setHasBody] = useState(false)

  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogA11yContext.Provider
        value={{
          hasHeader,
          hasBody,
          setHasHeader,
          setHasBody,
        }}
      >
        <DialogPrimitive.Content
          ref={ref}
          role={role}
          data-slot="dialog-content"
          {...(!hasBody && { "aria-describedby": undefined })}
          {...props}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100vh-40px)] w-[calc(100%-40px)] max-w-[322px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center overflow-auto rounded-[10px] bg-background-interactive-primary-sub p-5",
            className,
          )}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogA11yContext.Provider>
    </DialogPrimitive.Portal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

export const DialogHeader = ({
  className,
  children,
  ...props
}: DialogPrimitive.DialogTitleProps) => {
  const { setHasHeader } = useDialogA11y()

  useEffect(() => {
    setHasHeader(true)
    return () => setHasHeader(false)
  }, [setHasHeader])

  return (
    <DialogPrimitive.Title
      data-slot="dialog-header"
      className={cn(
        "typography-heading-md-semibold flex w-full flex-col items-center justify-center break-keep p-2.5 text-center text-text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  )
}
DialogHeader.displayName = "DialogHeader"

/**
 * DialogBody 컴포넌트
 *
 * @param srTitle - DialogHeader를 사용하지 않을 경우 스크린 리더 전용으로 제공할 제목.
 *                  시각적으로는 숨겨지지만 스크린 리더가 읽을 수 있습니다.
 *
 */
export const DialogBody = ({
  className,
  srTitle,
  ...props
}: DialogPrimitive.DialogDescriptionProps & {
  /** DialogHeader가 없을 때 스크린 리더 전용으로 제공할 제목 */
  srTitle?: string
}) => {
  const { hasHeader, setHasBody } = useDialogA11y()

  useEffect(() => {
    setHasBody(true)
    return () => setHasBody(false)
  }, [setHasBody])

  return (
    <>
      {!hasHeader && (
        <DialogPrimitive.Title className="sr-only">
          {srTitle}
        </DialogPrimitive.Title>
      )}
      <DialogPrimitive.Description
        data-slot="dialog-body"
        className={cn(
          "typography-body-lg-medium flex w-full flex-col items-center justify-center break-keep p-2.5 text-center text-text-secondary",
          className,
        )}
        {...props}
      />
    </>
  )
}
DialogBody.displayName = "DialogBody"

export const DialogFooter = ({
  className,
  ...props
}: ComponentProps<"div">) => (
  <>
    <div data-slot="dialog-spacer" />
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex w-full items-center justify-center gap-8 *:flex-1",
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
  Destructive: ({
    children,
    ...props
  }: ComponentProps<typeof DestructiveSolidBoxButton>) => (
    <DestructiveSolidBoxButton size="sm" _style="solid" {...props}>
      {children}
    </DestructiveSolidBoxButton>
  ),
}
