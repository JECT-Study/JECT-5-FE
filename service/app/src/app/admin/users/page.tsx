"use client"

import { useCallback, useMemo, useState } from "react"

import { useAdminUsers } from "@/entities/report/hooks/useAdminUsers"
import { AdminPageLayout } from "@/shared/ui/admin-layout"
import {
  useEmailSelection,
  UsersPageHeader,
  UsersTable,
  useUserBlockMutations,
} from "@/widgets/admin/users-table"

import { openBlockConfirmModal } from "./_components/dialog/blockConfirmModal"
import { openUnblockConfirmModal } from "./_components/dialog/unblockConfirmModal"

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

  const { blockMutation, unblockMutation } = useUserBlockMutations()

  const userEmails = useMemo(() => users.map((u) => u.email), [users])

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
      clearSelection()
    },
    [clearSelection],
  )

  const handleSelectAllUsers = useCallback(
    (checked: boolean) => {
      handleSelectAll(userEmails, checked)
    },
    [handleSelectAll, userEmails],
  )

  const handleBlock = useCallback(() => {
    openBlockConfirmModal({
      onConfirm: () => {
        blockMutation.mutate(Array.from(selectedEmails), {
          onSuccess: clearSelection,
        })
      },
    })
  }, [blockMutation, selectedEmails, clearSelection])

  const handleUnblock = useCallback(() => {
    openUnblockConfirmModal({
      onConfirm: () => {
        unblockMutation.mutate(Array.from(selectedEmails), {
          onSuccess: clearSelection,
        })
      },
    })
  }, [unblockMutation, selectedEmails, clearSelection])

  return (
    <AdminPageLayout
      header={
        <UsersPageHeader onBlock={handleBlock} onUnblock={handleUnblock} />
      }
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
