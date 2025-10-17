"use client"

import { Navigation } from "@ject-5-fe/design/components/navigation"

import DashboardNavigationRightContent from "./components/dashboardNavigationRightContent"
import { HomeButton } from "./components/homeButton"

interface DashboardNavigationProps {
  className?: string
}

export const DashboardNavigation = ({
  className,
}: DashboardNavigationProps) => {
  return (
    <Navigation
      className={className}
      leftContent={<HomeButton />}
      centerContent={
        <h1 className="typography-heading-xl-semibold text-text-primary">
          내 게임
        </h1>
      }
      rightContent={<DashboardNavigationRightContent />}
    />
  )
}
