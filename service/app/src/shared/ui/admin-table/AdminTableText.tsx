import { cn } from "@ject-5-fe/design/utils/cn"
import type { ReactNode } from "react"

type AdminTableTextTone = "header" | "body"

interface AdminTableTextProps {
  children: ReactNode
  className?: string
  tone?: AdminTableTextTone
}

export const AdminTableText = ({
  children,
  className,
  tone = "body",
}: AdminTableTextProps) => {
  const header =
    "typography-heading-md-medium text-text-interactive-secondary-hovered"
  const body = "typography-heading-md-medium text-text-interactive-input-filled"

  return (
    <span
      className={cn(
        "min-w-0 truncate",
        tone === "header" ? header : body,
        className,
      )}
      role={tone === "header" ? "columnheader" : "cell"}
    >
      {children}
    </span>
  )
}
