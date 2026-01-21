"use client"

import { AuthGuard } from "@/entities/auth/ui/authGuard"
import { DashboardNavigation } from "@/widgets/DashboardNavigation"

import { DashboardGameSection } from "./components/dashboardGameSection"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <main className="flex min-h-screen flex-col gap-120 bg-background-primary">
        <DashboardNavigation />
        <DashboardGameSection />
      </main>
    </AuthGuard>
  )
}
