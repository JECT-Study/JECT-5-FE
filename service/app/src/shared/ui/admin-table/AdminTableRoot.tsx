import { cn } from "@ject-5-fe/design/utils/cn"
import type { ReactNode } from "react"

interface AdminTableRootProps {
  children: ReactNode
  className?: string
}

export const AdminTableRoot = ({
  children,
  className,
}: AdminTableRootProps) => {
  return (
    <section className={cn("w-full", className)}>
      <div className="w-full overflow-x-auto">
        <div className="max-w-full">{children}</div>
      </div>
    </section>
  )
}
