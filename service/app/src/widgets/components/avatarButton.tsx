import { SecondaryPlainIconButton } from "@ject-5-fe/design/components/button"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "@ject-5-fe/design/components/menu"
import Image from "next/image"

interface AvatarButtonProps {
  src?: string
  onClick: () => void
}

export default function AvatarButton({
  src = "/avatar.svg",
  onClick,
}: AvatarButtonProps) {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>
        <SecondaryPlainIconButton size="lg" className="size-[42px] shrink-0">
          <Image
            src={src}
            alt="사용자 프로필 사진"
            width={42}
            height={42}
            className="size-full rounded-full"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzI3IiBoZWlnaHQ9IjQ1OSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
          />
        </SecondaryPlainIconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        type="vertical"
        contentType="text"
        sideOffset={22}
        align="end"
      >
        <DropdownMenuItem
          type="text"
          className="h-6 w-[134px] cursor-pointer rounded-[4px]"
          onClick={onClick}
        >
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  )
}
