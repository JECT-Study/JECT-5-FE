import { useMutation, useQueryClient } from "@tanstack/react-query"

import { blockUsers } from "@/entities/suspension/api/blockUsers"
import { unblockUsers } from "@/entities/suspension/api/unblockUsers"

export const useUserBlockMutations = () => {
  const queryClient = useQueryClient()

  const blockMutation = useMutation({
    mutationFn: (emails: string[]) =>
      blockUsers({
        banList: emails.map((email) => ({ email })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] })
    },
  })

  const unblockMutation = useMutation({
    mutationFn: (emails: string[]) =>
      unblockUsers({
        emails,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] })
    },
  })

  return {
    blockMutation,
    unblockMutation,
  }
}
