import { SecondaryPlainIconButton } from "@ject-5-fe/design/components/button"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "@ject-5-fe/design/components/menu"
import Image from "next/image"

import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/images"

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
            blurDataURL={DEFAULT_BLUR_DATA_URL}
          />
        </SecondaryPlainIconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        type="vertical"
        contentType="text"
        sideOffset={10}
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
