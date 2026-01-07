import { SecondaryPlainIconButton } from "@ject-5-fe/design/components/button"
import {
  DropdownMenuContent,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "@ject-5-fe/design/components/menu"
import { MoreDots } from "@ject-5-fe/design/icons"
import { cn } from "@ject-5-fe/design/utils/cn"
import NextImage from "next/image"
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react"
import { forwardRef } from "react"

interface GameCardProps extends ComponentPropsWithoutRef<"div"> {
  className?: string
  title?: string
  ["data-testid"]?: string
}

export const Root = forwardRef<HTMLDivElement, GameCardProps>(
  ({ children, className, ...props }, ref) => {
    const { ["data-testid"]: dataTestId, ...rest } = props

    return (
      <div
        ref={ref}
        className={cn("group relative flex flex-col gap-12", className)}
        role="group"
        data-testid={dataTestId ?? "gamecard-root"}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

Root.displayName = "GameCard"

interface ImageProps extends ComponentPropsWithoutRef<typeof NextImage> {
  imageClassName?: string
}

const DEFAULT_IMAGE_SIZES = "(max-width: 768px) 50vw, 178px"

export const Image = ({
  src,
  alt,
  className,
  imageClassName,
  children,
  sizes = DEFAULT_IMAGE_SIZES,
  ...imageProps
}: ImageProps) => {
  return (
    <div
      className={cn(
        "relative aspect-square w-full cursor-pointer overflow-hidden rounded-12",
        className,
      )}
      data-testid="gamecard-image"
    >
      <NextImage
        {...imageProps}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={cn("object-cover", imageClassName)}
        data-testid="gamecard-image-media"
      />
      {children}
    </div>
  )
}

type BadgeVariant = "top-left" | "bottom-left"

interface BadgeProps extends PropsWithChildren {
  variant?: BadgeVariant
  className?: string
}

const badgeVariantClassName = {
  "top-left": "left-8 top-8",
  "bottom-left": "bottom-8 left-8 bg-background-badge-secondary",
}

export const Badge = ({
  children,
  variant = "top-left",
  className,
}: BadgeProps) => {
  return (
    <div
      className={cn(
        "absolute inline-flex items-center justify-center rounded-4 bg-background-badge-primary px-4 py-2",
        badgeVariantClassName[variant],
        className,
      )}
      data-testid="gamecard-badge"
    >
      <span className="typography-body-md-medium text-text-inverse">
        {children}
      </span>
    </div>
  )
}

interface DescriptionProps extends PropsWithChildren {
  className?: string
}

export const Description = ({ children, className }: DescriptionProps) => {
  return (
    <p
      className={cn(
        "typography-body-lg-extrabold line-clamp-2 w-full break-keep text-text-primary",
        className,
      )}
      data-testid="gamecard-description"
    >
      {children}
    </p>
  )
}

interface OptionsProps extends PropsWithChildren {
  className?: string
  menuClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const Options = ({
  children,
  className,
  menuClassName,
  open,
  onOpenChange,
}: OptionsProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute right-8 top-8 opacity-0 transition-opacity duration-200 ease-out group-focus-within:opacity-100 group-hover:opacity-100",
        className,
      )}
      data-testid="gamecard-options"
    >
      <DropdownMenuRoot open={open} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <SecondaryPlainIconButton
            size="sm"
            className="pointer-events-auto"
            aria-label="게임 옵션"
            data-testid="gamecard-options-trigger"
            onClick={(event) => {
              event.stopPropagation()
            }}
            onKeyDown={(event) => {
              event.stopPropagation()
            }}
          >
            <MoreDots />
          </SecondaryPlainIconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={menuClassName}
          type="horizontal"
          contentType="icon"
          side="bottom"
          sideOffset={8}
          data-testid="gamecard-options-menu"
        >
          {children}
        </DropdownMenuContent>
      </DropdownMenuRoot>
    </div>
  )
}
