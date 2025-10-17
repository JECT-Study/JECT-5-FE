import Image from "next/image"

export default function CreateGamePageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-16 bg-background-primary">
      <Image
        src="/spinner.gif"
        alt="loading"
        width={100}
        height={100}
        unoptimized
      />
      <p className="typography-heading-md-bold">
        페이지를 준비하고 있습니다...
      </p>
    </div>
  )
}
