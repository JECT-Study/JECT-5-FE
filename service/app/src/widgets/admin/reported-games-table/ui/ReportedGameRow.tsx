import type { ReportedGame } from "@/entities/report/model/types"
import {
  AdminTableGroup,
  AdminTableRow,
  AdminTableText,
} from "@/shared/ui/admin-table"

interface ReportedGameRowProps {
  item: ReportedGame
  onClick?: (item: ReportedGame) => void
}

export const ReportedGameRow = ({ item, onClick }: ReportedGameRowProps) => {
  return (
    <AdminTableRow
      className="cursor-pointer gap-72"
      onClick={() => onClick?.(item)}
      aria-label={`게임명 ${item.title} 제작자 ${item.creatorName} 신고자 ${item.reporterName} 신고일자 ${item.reportedAt} 처리 여부 ${item.statusLabel}`}
      tabIndex={0}
    >
      <AdminTableGroup className="w-full gap-56 md:min-w-[400px] lg:min-w-[800px]">
        <AdminTableText className="min-w-[45px]">{item.id}</AdminTableText>
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
