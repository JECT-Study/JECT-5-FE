"use client"

import { Navigation } from "@ject-5-fe/design/components/navigation"

import { HomeButton } from "./components/homeButton"
import HomeNavigationRightContent from "./components/HomeNavigationRightContent"

interface HomeNavigationProps {
  isLoggedIn?: boolean
  className?: string
}

export const HomeNavigation = ({ className }: HomeNavigationProps) => {
  return (
    <Navigation
      className={className}
      leftContent={<HomeButton />}
      rightContent={<HomeNavigationRightContent />}
    />
  )
}
