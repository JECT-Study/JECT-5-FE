"use client"

import { useMemo, useState } from "react"

import { useAdminUsers } from "@/entities/report/hooks/useAdminUsers"
import { AdminPageLayout } from "@/shared/ui/admin-layout"
import {
  useEmailSelection,
  UsersPageHeader,
  UsersTable,
} from "@/widgets/admin/users-table"

export default function AdminUsersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const pageIndex = currentPage - 1

  const { users = [], totalPages } = useAdminUsers({
    page: pageIndex,
  })

  const {
    selectedEmails,
    handleSelectChange,
    handleSelectAll,
    clearSelection,
  } = useEmailSelection()

  const userEmails = useMemo(() => users.map((u) => u.email), [users])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    clearSelection()
  }

  const handleSelectAllUsers = (checked: boolean) => {
    handleSelectAll(userEmails, checked)
  }

  return (
    <AdminPageLayout
      header={<UsersPageHeader />}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    >
      <UsersTable
        items={users}
        selectedEmails={selectedEmails}
        onSelectChange={handleSelectChange}
        onSelectAll={handleSelectAllUsers}
      />
    </AdminPageLayout>
  )
}
