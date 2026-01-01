import Image from "next/image"

export default function MobilePage() {
  return (
    <div className="relative h-screen w-screen bg-background-primary">
      <div className="absolute left-1/2 top-1/3 flex w-[255px] -translate-x-1/2 flex-col items-center gap-[29px]">
        <Image
          src="/warning.svg"
          alt="경고 아이콘"
          width={60}
          height={60}
          priority
        />
        <p className="typography-heading-md-extrabold w-full whitespace-nowrap text-center text-text-primary">
          원활한 참여를 위해
          <br />
          <span className="text-text-interactive-primary">웹 브라우저</span>로
          접속해 주세요
        </p>
        <Image src="/logo-gray.svg" alt="홈 로고" width={140} height={30} />
      </div>
    </div>
  )
}
