import { cn } from "@ject-5-fe/design/utils/cn"
import type { ReactNode } from "react"

interface AdminTableGroupProps {
  children: ReactNode
  className?: string
}

export const AdminTableGroup = ({
  children,
  className,
}: AdminTableGroupProps) => {
  return (
    <div className={cn("flex min-w-0 items-center", className)}>{children}</div>
  )
}
