export const NavigationSkeleton = () => {
  return (
    <div className="flex items-center justify-end gap-16">
      <div className="h-[44px] w-[220px] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
      <div className="size-40 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    </div>
  )
}
