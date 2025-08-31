import type { Meta, StoryObj } from "@storybook/react-vite"

import { GameCard } from "../components/gameCard"
import { GameCardOptions } from "../components/gameCard/gameCardOptions"

interface StoryArgs {
  title?: string
}

const meta = {
  title: "Components/GameCard",
  component: GameCard,
  parameters: {
    layout: "centered",
    tags: ["autodocs"],
    argTypes: {
      title: {
        control: { type: "text" },
        description: "게임 카드 제목",
      },
    },
  },
} satisfies Meta<typeof GameCard>

export default meta
type Story = StoryObj<StoryArgs>

const SharedGameTemplate = (args: StoryArgs) => (
  <GameCard title={args.title}>
    <GameCard.Image>
      <div className="flex size-full items-center justify-center rounded-[10px] bg-black">
        <span className="font-bold text-white">게임 이미지</span>
      </div>
      <GameCard.Badge className="left-[8px] top-[8px]">12문제</GameCard.Badge>
      <GameCard.SharedBadge>공유</GameCard.SharedBadge>
    </GameCard.Image>
    <GameCard.Title>{args.title}</GameCard.Title>
  </GameCard>
)

const UnSharedGameTemplate = (args: StoryArgs) => (
  <GameCard title={args.title}>
    <GameCard.Image>
      <div className="flex size-full items-center justify-center rounded-[10px] bg-black">
        <span className="font-bold text-white">게임 이미지</span>
      </div>
      <GameCard.Badge className="left-[8px] top-[8px]">8문제</GameCard.Badge>
    </GameCard.Image>
    <GameCard.Title>{args.title}</GameCard.Title>
  </GameCard>
)

const MyGameTemplate = (args: StoryArgs) => (
  <GameCard title={args.title}>
    <GameCard.Image>
      <div className="flex size-full items-center justify-center rounded-[10px] bg-black">
        <span className="font-bold text-white">내 게임</span>
      </div>
      <GameCard.Badge className="left-[8px] top-[8px]">15문제</GameCard.Badge>
      <GameCard.SharedBadge>공유</GameCard.SharedBadge>
    </GameCard.Image>
    <div className="relative flex h-[46px] w-[178px] items-center justify-end">
      <div className="absolute left-6 line-clamp-2 h-[46px] w-[130px] shrink-0 overflow-hidden text-[19px] font-bold leading-[120%] text-text-primary">
        {args.title}
      </div>
      <div className="absolute right-0 top-[11px]">
        <GameCardOptions
          shared={true}
          onEdit={() => console.log("게임 수정")}
          onShare={() => console.log("게임 공유")}
          onDelete={() => console.log("게임 삭제")}
        />
      </div>
    </div>
  </GameCard>
)

export const SharedGame: Story = {
  args: {
    title: "공유 게임",
  },
  render: SharedGameTemplate,
  parameters: {
    docs: {
      description: {
        story:
          "**공유된 게임 카드**입니다. 좌측 하단에 공유 배지가 표시됩니다.",
      },
    },
  },
}

export const UnSharedGame: Story = {
  args: {
    title: "공유되지 않은 게임",
  },
  render: UnSharedGameTemplate,
  parameters: {
    docs: {
      description: {
        story:
          "**공유되지 않은 게임 카드**입니다. 좌측 하단에 공유 배지가 표시되지 않습니다.",
      },
    },
  },
}

export const MyGame: Story = {
  args: {
    title: "내 게임",
  },
  render: MyGameTemplate,
  parameters: {
    docs: {
      description: {
        story: "**내 게임 카드**입니다. 우측 하단에 옵션 버튼이 표시됩니다.",
      },
    },
  },
}

export const NoImageGame: Story = {
  args: {
    title: "이미지 없는 게임",
  },
  render: (args: StoryArgs) => (
    <GameCard title={args.title}>
      <GameCard.Image>
        <div className="flex size-full items-center justify-center rounded-[10px] bg-gray-200">
          <img src="/checker.svg" alt="게임 이미지" className="size-[178px]" />
        </div>
        <GameCard.Badge className="left-[8px] top-[8px]">5문제</GameCard.Badge>
      </GameCard.Image>
      <GameCard.Title>{args.title}</GameCard.Title>
    </GameCard>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "**이미지가 없는 게임 카드**입니다. 실제 사용 시 gameThumbnailUrl이 없을 때 보여지는 fallback 상태입니다.",
      },
    },
  },
}

export const LongTitleGame: Story = {
  args: {
    title:
      "매우 긴 제목의 게임입니다. 이 제목은 두 줄로 표시되어야 하며 line-clamp-2로 잘릴 수 있습니다",
  },
  render: UnSharedGameTemplate,
  parameters: {
    docs: {
      description: {
        story:
          "**긴 제목의 게임 카드**입니다. 제목이 2줄을 넘어가는 경우 line-clamp-2로 처리됩니다.",
      },
    },
  },
}

export const LongTitleMyGame: Story = {
  args: {
    title:
      "매우 긴 제목의 게임입니다. 이 제목은 두 줄로 표시되어야 하며 line-clamp-2로 잘릴 수 있습니다",
  },
  render: MyGameTemplate,
  parameters: {
    docs: {
      description: {
        story:
          "**긴 제목의 내 게임 카드**입니다. 제목이 2줄을 넘어가는 경우 line-clamp-2로 처리됩니다.",
      },
    },
  },
}

export const LoadingSkeleton: Story = {
  render: () => (
    <div className="flex w-[178px] flex-col items-start gap-[14px]">
      <div className="size-[178px] animate-pulse rounded-[10px] bg-gray-200" />
      <div className="h-[46px] w-[178px] animate-pulse rounded bg-gray-200" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "**로딩 스켈레톤**입니다. GameLibraryGrid에서 데이터 로딩 중일 때 표시되는 상태입니다.",
      },
    },
  },
}
