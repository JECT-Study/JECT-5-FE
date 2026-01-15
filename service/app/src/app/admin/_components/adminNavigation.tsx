import { SecondaryPlainBoxButton } from "@ject-5-fe/design/components/button"
import { Navigation } from "@ject-5-fe/design/components/navigation"
import { cn } from "@ject-5-fe/design/utils/cn"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { HomeButton } from "@/widgets/components/homeButton"

export const AdminNavigation = () => {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  const navItemClass = (active: boolean) =>
    cn(
      "typography-heading-md-semibold",
      active
        ? "text-text-interactive-secondary"
        : "text-text-interactive-tertiary",
    )
  return (
    <Navigation
      leftContent={
        <div className="flex shrink-0 items-center gap-12">
          <HomeButton />
          <span className="typography-heading-md-semibold text-text-interactive-secondary-hovered">
            관리자페이지
          </span>
        </div>
      }
      rightContent={
        <div className="flex shrink-0 items-center gap-52">
          <SecondaryPlainBoxButton
            asChild
            className={navItemClass(isActive("/admin/reports"))}
          >
            <Link href="/admin/reports">신고접수</Link>
          </SecondaryPlainBoxButton>
          <SecondaryPlainBoxButton
            asChild
            className={navItemClass(isActive("/admin/games"))}
          >
            <Link href="/admin/games">게임관리</Link>
          </SecondaryPlainBoxButton>
          <SecondaryPlainBoxButton
            asChild
            className={navItemClass(isActive("/admin/users"))}
          >
            <Link href="/admin/users">회원관리</Link>
          </SecondaryPlainBoxButton>
        </div>
      }
    />
  )
}
