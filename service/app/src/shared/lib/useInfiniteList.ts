import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

interface UseInfiniteListParams<TData, TPageParam> {
  queryKey: unknown[]
  queryFn: (pageParam: TPageParam) => Promise<TData>
  getNextPageParam: (lastPage: TData) => TPageParam | undefined
  enabled?: boolean
  initialData?: {
    pages: TData[]
    pageParams: TPageParam[]
  }
}

export function useInfiniteList<
  TItem,
  TData extends { games: TItem[] },
  TPageParam,
>({
  queryKey,
  queryFn,
  getNextPageParam,
  initialData,
}: UseInfiniteListParams<TData, TPageParam>) {
  const {
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    error,
  } = useSuspenseInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => await queryFn(pageParam as TPageParam),
    initialPageParam: undefined as TPageParam,
    getNextPageParam,
    initialData,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

  const games = data?.pages.flatMap((page) => page.games) ?? []

  return {
    games,
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    refetch,
    error,
  }
}
