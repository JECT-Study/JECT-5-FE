"use client"

interface HeroSectionProps {
  className?: string
}

export const HeroSection = ({ className = "" }: HeroSectionProps) => {
  return (
    <div className={`flex w-full justify-center p-[10px] ${className}`}>
      <h1 className="typography-heading-3xl-semibold text-center text-neutral-black">
        모두가 가볍게 즐길 수 있는 라이트 레크레이션
      </h1>
    </div>
  )
} 