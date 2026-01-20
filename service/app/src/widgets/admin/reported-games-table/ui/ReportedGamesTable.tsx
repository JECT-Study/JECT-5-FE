import type { ReportedGame } from "@/entities/report/model/types"
import {
  AdminTableGroup,
  AdminTableRoot,
  AdminTableRow,
  AdminTableText,
} from "@/shared/ui/admin-table"

import { ReportedGameRow } from "./ReportedGameRow"

interface ReportedGamesTableProps {
  items: ReportedGame[]
  onRowClick?: (item: ReportedGame) => void
}

export const ReportedGamesTable = ({
  items,
  onRowClick,
}: ReportedGamesTableProps) => {
  return (
    <AdminTableRoot>
      <AdminTableRow variant="header" className="gap-72">
        <AdminTableGroup className="w-full gap-56 md:min-w-[400px] lg:min-w-[800px]">
          <AdminTableText tone="header" className="min-w-[45px]">
            번호
          </AdminTableText>
          <AdminTableText tone="header">게임명</AdminTableText>
        </AdminTableGroup>

        <AdminTableGroup className="w-full gap-60">
          <AdminTableText tone="header">제작자</AdminTableText>
          <AdminTableText tone="header">신고자</AdminTableText>
        </AdminTableGroup>

        <AdminTableGroup className="w-full gap-24">
          <AdminTableText tone="header" className="min-w-[200px]">
            신고일자
          </AdminTableText>
          <AdminTableText tone="header">처리 여부</AdminTableText>
        </AdminTableGroup>
      </AdminTableRow>

      {items.map((item) => (
        <ReportedGameRow key={item.id} item={item} onClick={onRowClick} />
      ))}
    </AdminTableRoot>
  )
}
