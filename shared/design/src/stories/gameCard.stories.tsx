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
    docs: {
      description: {
        component: `
## 🎮 GameCard 컴포넌트 - 게임 카드 표시

게임 목록에서 사용되는 게임 카드 컴포넌트입니다. **Compound Component Pattern**을 사용하여 유연한 구성이 가능합니다.

### 🏗️ 주요 특징

- **Radix UI 기반**: DropdownMenu와 BaseButton(Slot)을 사용한 안정적인 접근성
- **유연한 레이아웃**: Dashboard와 Library 두 가지 스타일 지원
- **동적 배지**: 문제 수와 공유 상태에 따른 자동 배지 표시
- **옵션 메뉴**: 편집/공유/삭제 기능이 포함된 별도 컴포넌트

### 📱 언제 사용하나요?

- **게임 라이브러리**: 전체 게임 목록 표시
- **대시보드**: 내 게임 관리 (옵션 메뉴 포함)
- **게임 탐색**: 다른 사용자의 공유 게임 브라우징

### ⚠️ 주의사항

- shared/design에서는 일반 img 태그 사용 (Next.js 독립적)
- 이미지 크기는 178×178px 권장
- Dashboard 스타일에서는 GameCardOptions 별도 배치 필요

### 🔗 관련 컴포넌트

- \`GameCardOptions\`: 옵션 드롭다운 메뉴
- \`SecondaryPlainIconButton\`: 옵션 메뉴 트리거
- \`DropdownMenu\`: Radix UI 기반 메뉴 시스템

### 🔄 Figma 디자인 대비 주요 변경사항

#### 1. **Compound Component Pattern 도입**
**변경 전 (Figma)**: 5개 고정 배리언트 (\`type × optionView\` 조합)  
**변경 후 (현재)**: 유연한 조합 가능한 합성 컴포넌트

\`\`\`typescript
// Figma: 고정된 배리언트
<GameCardComponent variant="type=myGame,optionView=true" />

// 현재: 자유로운 구성
<GameCard title="게임 제목">
  <GameCard.Image>
    <img src="/image.jpg" alt="게임 이미지" />
    <GameCard.Badge>10문제</GameCard.Badge>
    {isShared && <GameCard.SharedBadge>공유</GameCard.SharedBadge>}
  </GameCard.Image>
  <GameCard.Title>게임 제목</GameCard.Title>
</GameCard>
\`\`\`

#### 2. **옵션 메뉴 분리**
**변경 전**: 컴포넌트에 내장된 드롭다운  
**변경 후**: 별도 \`GameCardOptions\` 컴포넌트로 분리

#### 3. **이미지 처리 방식 개선**
**프레임워크 독립적**: Next.js Image와 일반 img 태그 모두 지원
        `,
      },
    },
    tags: ["autodocs"],
  },
  argTypes: {
    title: {
      control: { type: "text" },
      description:
        "**게임 카드 접근성 라벨**\n- 선택적 prop으로 제공 시 `{title} 게임 카드`로 aria-label 생성\n- E2E 테스트에서 특정 게임 카드 식별에 활용",
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
