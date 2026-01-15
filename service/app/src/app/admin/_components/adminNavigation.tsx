import { Navigation } from "@ject-5-fe/design/components/navigation"

import { HomeButton } from "@/widgets/components/homeButton"

export const AdminNavigation = () => {
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
          <span className="typography-heading-md-semibold text-text-interactive-secondary">
            신고접수
          </span>
          <span className="typography-heading-md-semibold text-text-interactive-tertiary">
            게임관리
          </span>
          <span className="typography-heading-md-semibold text-text-interactive-tertiary">
            회원관리
          </span>
        </div>
      }
    />
  )
}
