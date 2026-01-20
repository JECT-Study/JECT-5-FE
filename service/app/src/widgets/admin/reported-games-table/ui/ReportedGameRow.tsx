import type { ReportedGame } from "@/entities/report/model/types"
import {
  AdminTableGroup,
  AdminTableRow,
  AdminTableText,
} from "@/shared/ui/admin-table"

interface ReportedGameRowProps {
  item: ReportedGame
}

export const ReportedGameRow = ({ item }: ReportedGameRowProps) => {
  return (
    <AdminTableRow className="gap-72">
      <AdminTableGroup className="w-full gap-56 md:min-w-[400px] lg:min-w-[800px]">
        <AdminTableText className="min-w-[45px]">{item.no}</AdminTableText>
        <AdminTableText>{item.title}</AdminTableText>
      </AdminTableGroup>

      <AdminTableGroup className="w-full gap-60">
        <AdminTableText>{item.creatorName}</AdminTableText>
        <AdminTableText>{item.reporterName}</AdminTableText>
      </AdminTableGroup>

      <AdminTableGroup className="w-full gap-24">
        <AdminTableText className="min-w-[200px]">
          {item.reportedAt}
        </AdminTableText>
        <AdminTableText>{item.statusLabel}</AdminTableText>
      </AdminTableGroup>
    </AdminTableRow>
  )
}
