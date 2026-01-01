interface HeroSectionProps {
  className?: string
}

export const HeroSection = ({ className = "" }: HeroSectionProps) => {
  return (
    <section
      className={`flex w-full flex-col items-center justify-center gap-0 self-stretch px-0 py-8 ${className}`}
      aria-label="메인 히어로 섹션"
    >
      <h1
        className="typography-heading-2xl-extrabold text-center font-joyofsinging text-text-interactive-secondary"
        data-testid="hero-title"
      >
        모두가 가볍게 즐길 수 있는
        <br />
        <span className="text-text-interactive-primary">라이트</span> 레크레이션
      </h1>
    </section>
  )
}
