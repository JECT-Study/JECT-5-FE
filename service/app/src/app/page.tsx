"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { useAuth } from "@/entities/auth"

import { GameSection } from "../widgets/GameSection"
import { HeroSection } from "../widgets/HeroSection"
import { HomeNavigation } from "../widgets/HomeNavigation"

function ErrorFallback({ resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div 
      role="alert" 
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background-primary p-4"
      aria-live="assertive"
    >
      <h2 className="typography-heading-lg-semibold text-text-interactive-secondary">
        문제가 발생했습니다
      </h2>
      <p className="text-center text-text-interactive-secondary">
        페이지를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.
      </p>
      <button
        onClick={resetErrorBoundary}
        className="rounded-lg bg-background-interactive-primary px-4 py-2 text-text-interactive-inverse hover:bg-background-interactive-primary-hovered focus:outline-none focus:ring-2 focus:ring-border-interactive-primary focus:ring-offset-2"
        aria-label="페이지 다시 로드"
      >
        다시 시도
      </button>
    </div>
  )
}

function HomeSkeleton() {
  return (
    <main className="min-h-screen bg-background-primary" aria-live="polite" aria-label="페이지 로딩 중">
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
            <div key={index} className="flex w-[178px] flex-col items-start gap-[14px]">
              <div className="size-[178px] animate-pulse rounded-[10px] bg-gray-200" />
              <div className="h-[46px] w-[178px] animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

function HomeContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  if (authLoading) {
    return <HomeSkeleton />
  }

  return (
    <main 
      className="min-h-screen bg-background-primary"
      role="main"
      aria-label="홈페이지"
    >
      <HomeNavigation isLoggedIn={isAuthenticated} />
      <div className="h-[157px]" />
      <HeroSection />
      <div className="h-[70px]" />
      <GameSection />
    </main>
  )
}

export default function Home() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error: Error, errorInfo: { componentStack?: string | null | undefined }) => {
        console.error("Home page error:", error, errorInfo)
      }}
    >
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent />
      </Suspense>
    </ErrorBoundary>
  )
}
