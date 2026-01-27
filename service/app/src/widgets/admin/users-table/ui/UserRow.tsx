import { Checkbox } from "@ject-5-fe/design/components/checkBox"

import { REPORT_REASON_LABELS } from "@/entities/game/model/report"
import type { AdminUser } from "@/entities/report/model/types"
import {
  AdminTableGroup,
  AdminTableRow,
  AdminTableText,
} from "@/shared/ui/admin-table"

interface UserRowProps {
  item: AdminUser
  selected: boolean
  onSelect: (email: string, checked: boolean) => void
}

export const UserRow = ({ item, selected, onSelect }: UserRowProps) => {
  const blockReasonLabel = item.blockReason
    ? REPORT_REASON_LABELS[item.blockReason]
    : "-"

  return (
    <div className="flex items-center gap-16">
      <div className="flex shrink-0 items-center justify-center">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect(item.email, checked)}
        />
      </div>
      <AdminTableRow
        className="flex-1 gap-40"
        aria-label={`이름 ${item.nickname} 이메일 ${item.email} 차단 여부 ${item.blocked ? "차단됨" : "활성"}`}
      >
        <AdminTableGroup className="w-full gap-40 md:min-w-[500px] lg:min-w-[600px]">
          <AdminTableText className="min-w-[100px]">
            {item.nickname}
          </AdminTableText>
          <AdminTableText className="min-w-[400px]">
            {item.email}
          </AdminTableText>
        </AdminTableGroup>

        <AdminTableGroup className="w-full gap-40">
          <AdminTableText className="min-w-[300px]">
            {blockReasonLabel}
          </AdminTableText>
          <AdminTableText className="min-w-[200px]">
            {item.blockedAt ?? "-"}
          </AdminTableText>
        </AdminTableGroup>

        <AdminTableText className="min-w-[100px]">
          {item.blocked ? "차단됨" : "활성"}
        </AdminTableText>
      </AdminTableRow>
    </div>
  )
}
