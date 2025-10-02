export default function HomeSkeleton() {
  return (
    <main
      className="min-h-screen bg-background-primary"
      aria-live="polite"
      aria-label="페이지 로딩 중"
    >
      <div className="flex h-[110px] w-full items-center justify-between bg-background-tertiary">
        <div className="flex w-[420px] items-center gap-2.5 px-10">
          <div className="h-[60px] w-[268px] animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex w-[420px] flex-col items-end justify-center gap-2.5">
          <div className="flex items-center gap-4 px-10">
            <div className="h-[32px] w-[120px] animate-pulse rounded bg-gray-200" />
            <div className="size-[32px] animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="h-[157px]" />

      <section className="flex w-full flex-col items-center gap-[24px]">
        <div className="flex w-full flex-col items-center text-center">
          <div className="h-[48px] w-[600px] animate-pulse rounded bg-gray-200" />
        </div>
      </section>

      <div className="h-[70px]" />

      <section className="flex w-full flex-col items-center gap-[45px]">
        <div className="flex w-[952px] items-center justify-between">
          <div className="h-[28px] w-[300px] animate-pulse rounded bg-gray-200" />
          <div className="h-[32px] w-[120px] animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex items-center gap-[80px]">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex w-[178px] flex-col items-start gap-[14px]"
            >
              <div className="size-[178px] animate-pulse rounded-[10px] bg-gray-200" />
              <div className="h-[46px] w-[178px] animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
