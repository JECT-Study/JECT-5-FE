"use client"

import { useAuthGuard } from "@/entities/auth/model/hooks/useAuthGuard"
import { DashboardNavigation } from "@/widgets/DashboardNavigation"

import { DashboardGameSection } from "./components/dashboardGameSection"

export default function DashboardPage() {
  useAuthGuard()

  return (
    <main className="flex min-h-screen flex-col gap-120 bg-background-primary">
      <DashboardNavigation />
      <DashboardGameSection />
    </main>
  )
}
