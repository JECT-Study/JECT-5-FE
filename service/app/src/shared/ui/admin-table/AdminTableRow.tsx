import { cn } from "@ject-5-fe/design/utils/cn"
import type { ReactNode } from "react"

type AdminTableRowVariant = "header" | "data"

interface AdminTableRowProps {
  children: ReactNode
  className?: string
  variant?: AdminTableRowVariant
}

export const AdminTableRow = ({
  children,
  className,
  variant = "data",
}: AdminTableRowProps) => {
  const base = "flex items-center py-20 min-w-0 px-16"
  const border = "border border-border-interactive-tertiary"
  const bg =
    variant === "header"
      ? "bg-background-interactive-secondary-hovered"
      : "bg-transparent"

  return <div className={cn(base, border, bg, className)}>{children}</div>
}
