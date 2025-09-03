import { useMutation, useQuery } from "@tanstack/react-query"

import { queryClient } from "@/shared/lib/queryClient"

import { kakaoLogin } from "../api/kakaoLogin"
import { deleteCookie, hasValidSession } from "../utils/cookieUtils"

export function useAuth() {
  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: hasValidSession,
    enabled: true,
    retry: false,
    refetchInterval: 5 * 60 * 1000,
    retryOnMount: false,
  })

  const loginMutation = useMutation({
    mutationFn: kakaoLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "session"] })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      deleteCookie("JSESSIONID")
      return true
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "session"] })
    },
  })

  return {
    isAuthenticated: !!sessionQuery.data,
    isCheckingSession: sessionQuery.isLoading,
    refetch: sessionQuery.refetch,
    isError: sessionQuery.isError,
    logout: logoutMutation.mutate,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  }
}
