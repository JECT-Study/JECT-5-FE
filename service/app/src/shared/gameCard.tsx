import { SecondaryPlainIconButton } from "@shared/design/src/components/button"
import {
  DropdownMenuContent,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "@shared/design/src/components/menu"
import { MoreDot } from "@shared/design/src/icons"
import { cn } from "@shared/design/src/utils/cn"
import NextImage from "next/image"
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react"
import { forwardRef } from "react"

interface GameCardProps extends ComponentPropsWithoutRef<"div"> {
  className?: string
  title?: string
}

export const Root = forwardRef<HTMLDivElement, GameCardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("group relative flex flex-col gap-12", className)}
        role="group"
        {...props}
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
    >
      <NextImage
        {...imageProps}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={cn("object-cover", imageClassName)}
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

const badgeVariantClassName: Record<BadgeVariant, string> = {
  "top-left": "left-8 top-8",
  "bottom-left": "bottom-8 left-8",
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
        "typography-body-lg-bold line-clamp-2 w-full break-keep text-text-secondary",
        className,
      )}
    >
      {children}
    </p>
  )
}

interface OptionsProps extends PropsWithChildren {
  className?: string
  menuClassName?: string
}

export const Options = ({
  children,
  className,
  menuClassName,
}: OptionsProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute right-8 top-8 opacity-0 transition-opacity duration-200 ease-out group-focus-within:opacity-100 group-hover:opacity-100",
        className,
      )}
    >
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <SecondaryPlainIconButton
            size="sm"
            className="pointer-events-auto"
            onClick={(event) => {
              event.stopPropagation()
            }}
            onKeyDown={(event) => {
              event.stopPropagation()
            }}
          >
            <MoreDot />
          </SecondaryPlainIconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={menuClassName}
          type="horizontal"
          contentType="icon"
          side="bottom"
          sideOffset={8}
        >
          {children}
        </DropdownMenuContent>
      </DropdownMenuRoot>
    </div>
  )
}
