import { Checkbox } from "@ject-5-fe/design/components/checkBox"

import type { AdminUser } from "@/entities/report/model/types"
import {
  AdminTableGroup,
  AdminTableRow,
  AdminTableText,
} from "@/shared/ui/admin-table"

import { UserRow } from "./UserRow"

interface UsersTableProps {
  items: AdminUser[]
  selectedEmails: Set<string>
  onSelectChange: (email: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
}

export const UsersTable = ({
  items,
  selectedEmails,
  onSelectChange,
  onSelectAll,
}: UsersTableProps) => {
  const allSelected =
    items.length > 0 && items.every((item) => selectedEmails.has(item.email))

  return (
    <section
      className="w-full shrink overflow-y-auto"
      role="table"
      aria-label="사용자 관리 테이블"
    >
      <div className="flex shrink-0 items-center gap-16">
        <div className="flex shrink-0 items-center justify-center">
          <Checkbox
            checked={allSelected}
            onCheckedChange={onSelectAll}
            containerClassName="h-full flex items-center"
          />
        </div>
        <AdminTableRow
          variant="header"
          className="flex-1 gap-40"
          aria-label="사용자 관리 테이블 헤더"
        >
          <AdminTableGroup className="w-full gap-40 md:min-w-[500px] lg:min-w-[600px]">
            <AdminTableText tone="header" className="min-w-[100px]">
              이름
            </AdminTableText>
            <AdminTableText tone="header" className="min-w-[400px]">
              이메일
            </AdminTableText>
          </AdminTableGroup>

          <AdminTableGroup className="w-full gap-40">
            <AdminTableText tone="header" className="min-w-[300px]">
              정지 사유
            </AdminTableText>
            <AdminTableText tone="header" className="min-w-[200px]">
              정지 일자
            </AdminTableText>
          </AdminTableGroup>

          <AdminTableText tone="header" className="min-w-[100px]">
            차단 여부
          </AdminTableText>
        </AdminTableRow>
      </div>

      {items.map((item) => (
        <UserRow
          key={item.email}
          item={item}
          selected={selectedEmails.has(item.email)}
          onSelect={onSelectChange}
        />
      ))}
    </section>
  )
}
