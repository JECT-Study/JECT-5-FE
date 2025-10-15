"use client"

import { Navigation } from "@shared/design/src/components/navigation"

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
