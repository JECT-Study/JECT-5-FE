import dynamic from "next/dynamic"

import { HomeButton } from "@/widgets/components/homeButton"

import { NavigationSkeleton } from "../loading"

const HomeNavigationClient = dynamic(
  () =>
    import("./homeNavigationClient").then((mod) => ({
      default: mod.HomeNavigationClient,
    })),
  {
    ssr: false,
    loading: () => <NavigationSkeleton />,
  },
)

interface HomeNavigationProps {
  className?: string
}

export const HomeNavigation = ({ className = "" }: HomeNavigationProps) => {
  const leftContent = <HomeButton />

  return (
    <nav
      className={`flex h-[90px] w-full shrink-0 items-center justify-between px-10 ${className}`}
    >
      {leftContent}
      <HomeNavigationClient />
    </nav>
  )
}
