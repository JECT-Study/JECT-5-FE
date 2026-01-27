import { useQuery } from "@tanstack/react-query"

import { getAdminUsers } from "../api/getAdminUsers"
import type { AdminUser } from "../model/types"

interface UseAdminUsersParams {
  page?: number
  enabled?: boolean
}

interface UseAdminUsersReturn {
  users: AdminUser[]
  currentPage: number
  totalPages: number
  totalElements: number
  isLoading: boolean
  error: Error | null
}

export const useAdminUsers = ({
  page = 0,
  enabled = true,
}: UseAdminUsersParams = {}): UseAdminUsersReturn => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminUsers", { page }] as const,
    queryFn: async () => {
      const response = await getAdminUsers({ page })
      return response
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

  return {
    users: data?.content ?? [],
    currentPage: data?.page ?? page,
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    isLoading,
    error: error as Error | null,
  }
}
