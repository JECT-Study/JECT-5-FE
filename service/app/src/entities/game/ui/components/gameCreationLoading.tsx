"use client"

export function GameCreationLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-white">
      <div className="flex flex-col items-center gap-4">
        <div className="size-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent"></div>
        <p className="text-sm text-gray-600">게임 데이터를 불러오는 중...</p>
      </div>
    </div>
  )
}
