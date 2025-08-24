import type { Meta, StoryObj } from "@storybook/react-vite"

import { GameCard } from "../components/gameCard"
import { GameCardOptions } from "../components/gameCard/gameCardOptions"
import { MyGameCard } from "../components/gameCard/myGameCard"

const meta: Meta<typeof GameCard> = {
  title: "Components/GameCard",
  component: GameCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# GameCard Component

합성 컴포넌트 패턴을 사용하는 게임 카드 컴포넌트입니다. 외부에서 이미지와 콘텐츠를 자유롭게 주입할 수 있습니다.

## 🏗️ 컴포넌트 구조

### 합성 컴포넌트 패턴
\`\`\`tsx
<GameCard>
  <GameCard.Image>
    <Image src="..." alt="..." fill />
    <GameCard.Badge>10문제</GameCard.Badge>
    <GameCard.SharedBadge>공유</GameCard.SharedBadge>
  </GameCard.Image>
  <GameCard.Title>게임 제목</GameCard.Title>
</GameCard>
\`\`\`

### 서브컴포넌트
- **GameCard.Image**: 이미지 컨테이너 (기본: 178px × 178px)
- **GameCard.Title**: 제목 영역 (46px 높이)
- **GameCard.Badge**: 문제 수 배지 (좌상단)
- **GameCard.SharedBadge**: 공유 배지 (좌하단)

## 🎮 사용 예시

### 기본 GameCard
\`\`\`tsx
<GameCard>
  <GameCard.Image>
    <Image src="game-image.jpg" alt="게임" fill />
    <GameCard.Badge>10문제</GameCard.Badge>
  </GameCard.Image>
  <GameCard.Title>수학 퀴즈 게임</GameCard.Title>
</GameCard>
\`\`\`

### MyGameCard (게임 관리 기능 포함)
\`\`\`tsx
<MyGameCard>
  <GameCard.Image>
    <Image src="my-game.jpg" alt="내 게임" fill />
    <GameCard.Badge>15문제</GameCard.Badge>
    <GameCard.SharedBadge>공유</GameCard.SharedBadge>
  </GameCard.Image>
  <div className="flex h-[46px] w-[178px] items-center justify-between">
    <div className="line-clamp-2 h-[46px] w-[130px] shrink-0 overflow-hidden text-[19px] font-bold leading-[120%] text-text-primary">
      내가 만든 게임
    </div>
    <GameCardOptions
      shared={true}
      onEdit={() => console.log("수정")}
      onShare={() => console.log("공유")}
      onDelete={() => console.log("삭제")}
    />
  </div>
</MyGameCard>
\`\`\`

### GamePreview (큰 이미지)
\`\`\`tsx
<GameCard>
  <GameCard.Image className="h-[260px]">
    <Image src="preview.jpg" alt="미리보기" fill />
  </GameCard.Image>
  <GameCard.Title>게임 미리보기</GameCard.Title>
</GameCard>
\`\`\`

## 🎨 주요 특징

### 🖼️ Next.js Image 지원
모든 이미지는 Next.js Image 컴포넌트를 사용하여 최적화됩니다:

\`\`\`tsx
<GameCard.Image>
  <Image
    src="game-image.jpg"
    alt="게임"
    fill
    className="rounded-[10px] object-cover"
    sizes="178px"
    placeholder="blur"
    blurDataURL="data:image/svg+xml;base64,..."
  />
</GameCard.Image>
\`\`\`

### 🏷️ 배지 시스템
- **GameCard.Badge**: 문제 수 표시 (좌상단)
- **GameCard.SharedBadge**: 공유 상태 표시 (좌하단)
- **위치 조정**: className으로 위치 커스터마이징 가능

### 📝 제목 처리
- **기본**: 46px 높이, 2줄 제한
- **MyGameCard**: 130px 너비로 제한하여 MoreDot 버튼과 배치

## 🎯 Figma 연동

모든 컴포넌트는 Figma 디자인 시스템과 완벽히 동기화됩니다:

- **기본 크기**: 178px × 178px (이미지)
- **GamePreview**: 178px × 260px (큰 이미지)
- **제목 영역**: 46px 높이
- **간격**: 14px (이미지-제목 사이)
- **타이포그래피**: 19px, font-bold, line-clamp-2

## ⚠️ 주의사항

### 🎮 컴포넌트 조합
- **GameCard**: 기본 게임 카드
- **MyGameCard**: 게임 관리 기능이 필요한 경우
- **GameCardOptions**: MoreDot 드롭다운 메뉴

### 🖼️ 이미지 처리
- **Next.js Image 필수**: 성능 최적화를 위해 Next.js Image 사용
- **fill prop**: 부모 컨테이너에 맞춰 이미지 크기 조정
- **placeholder**: blur 효과로 로딩 상태 표시

### 🎯 접근성
- **alt 텍스트**: 모든 이미지에 적절한 alt 텍스트 제공
- **키보드 네비게이션**: MoreDot 버튼 키보드 접근성 지원
- **색상 대비**: 배지와 텍스트의 색상 대비 WCAG AA 기준 준수
        `,
      },
    },
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

// 기본 GameCard 스토리
export const BasicGameCard: Story = {
  render: () => (
    <GameCard>
      <GameCard.Image>
        <div className="flex size-full items-center justify-center rounded-[10px] bg-gradient-to-br from-blue-400 to-purple-500">
          <span className="font-bold text-white">게임 이미지</span>
        </div>
        <GameCard.Badge>10문제</GameCard.Badge>
      </GameCard.Image>
      <GameCard.Title>수학 퀴즈 게임</GameCard.Title>
    </GameCard>
  ),
}

// 공유된 게임 카드
export const SharedGameCard: Story = {
  render: () => (
    <GameCard>
      <GameCard.Image>
        <div className="flex size-full items-center justify-center rounded-[10px] bg-gradient-to-br from-green-400 to-blue-500">
          <span className="font-bold text-white">공유 게임</span>
        </div>
        <GameCard.Badge>15문제</GameCard.Badge>
        <GameCard.SharedBadge>공유</GameCard.SharedBadge>
      </GameCard.Image>
      <GameCard.Title>공유된 게임</GameCard.Title>
    </GameCard>
  ),
}

// 긴 제목 게임 카드
export const LongTitleGameCard: Story = {
  render: () => (
    <GameCard>
      <GameCard.Image>
        <div className="flex size-full items-center justify-center rounded-[10px] bg-gradient-to-br from-red-400 to-pink-500">
          <span className="font-bold text-white">긴 제목</span>
        </div>
        <GameCard.Badge>20문제</GameCard.Badge>
      </GameCard.Image>
      <GameCard.Title>
        매우 긴 제목의 게임입니다. 이 제목은 두 줄로 표시되어야 합니다.
      </GameCard.Title>
    </GameCard>
  ),
}

// 이미지 없는 게임 카드
export const NoImageGameCard: Story = {
  render: () => (
    <GameCard>
      <GameCard.Image>
        <div className="flex size-full items-center justify-center rounded-[10px] bg-gray-200">
          <span className="text-[14px] font-medium text-gray-500">
            이미지 없음
          </span>
        </div>
        <GameCard.Badge>8문제</GameCard.Badge>
      </GameCard.Image>
      <GameCard.Title>이미지 없는 게임</GameCard.Title>
    </GameCard>
  ),
}

// MyGameCard 스토리
export const MyGameCardStory: Story = {
  render: () => (
    <MyGameCard>
      <GameCard.Image>
        <div className="flex size-full items-center justify-center rounded-[10px] bg-gradient-to-br from-yellow-400 to-orange-500">
          <span className="font-bold text-white">내 게임</span>
        </div>
        <GameCard.Badge className="left-[8px] top-[8px]">12문제</GameCard.Badge>
        <GameCard.SharedBadge>공유</GameCard.SharedBadge>
      </GameCard.Image>
      <div className="flex h-[46px] w-[178px] items-center justify-between">
        <div className="line-clamp-2 h-[46px] w-[130px] shrink-0 overflow-hidden text-[19px] font-bold leading-[120%] text-text-primary">
          내가 만든 게임
        </div>
        <GameCardOptions
          shared={true}
          onEdit={() => console.log("게임 수정")}
          onShare={() => console.log("게임 공유")}
          onDelete={() => console.log("게임 삭제")}
        />
      </div>
    </MyGameCard>
  ),
}

// GamePreview 스토리 (큰 이미지)
export const GamePreview: Story = {
  render: () => (
    <GameCard>
      <GameCard.Image className="h-[260px]">
        <div className="flex size-full items-center justify-center rounded-[10px] bg-gradient-to-br from-purple-400 to-indigo-500">
          <span className="text-lg font-bold text-white">게임 미리보기</span>
        </div>
      </GameCard.Image>
      <GameCard.Title>게임 미리보기 제목</GameCard.Title>
    </GameCard>
  ),
}

// 모든 변형을 보여주는 그리드
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6">
      <GameCard>
        <GameCard.Image>
          <div className="flex size-full items-center justify-center rounded-[10px] bg-gradient-to-br from-blue-400 to-purple-500">
            <span className="font-bold text-white">게임 이미지</span>
          </div>
          <GameCard.Badge>10문제</GameCard.Badge>
        </GameCard.Image>
        <GameCard.Title>수학 퀴즈 게임</GameCard.Title>
      </GameCard>

      <GameCard>
        <GameCard.Image>
          <div className="flex size-full items-center justify-center rounded-[10px] bg-gradient-to-br from-green-400 to-blue-500">
            <span className="font-bold text-white">공유 게임</span>
          </div>
          <GameCard.Badge>15문제</GameCard.Badge>
          <GameCard.SharedBadge>공유</GameCard.SharedBadge>
        </GameCard.Image>
        <GameCard.Title>공유된 게임</GameCard.Title>
      </GameCard>

      <GameCard>
        <GameCard.Image>
          <div className="flex size-full items-center justify-center rounded-[10px] bg-gradient-to-br from-red-400 to-pink-500">
            <span className="font-bold text-white">긴 제목</span>
          </div>
          <GameCard.Badge>20문제</GameCard.Badge>
        </GameCard.Image>
        <GameCard.Title>
          매우 긴 제목의 게임입니다. 이 제목은 두 줄로 표시되어야 합니다.
        </GameCard.Title>
      </GameCard>

      <GameCard>
        <GameCard.Image>
          <div className="flex size-full items-center justify-center rounded-[10px] bg-gray-200">
            <span className="text-[14px] font-medium text-gray-500">
              이미지 없음
            </span>
          </div>
          <GameCard.Badge>8문제</GameCard.Badge>
        </GameCard.Image>
        <GameCard.Title>이미지 없는 게임</GameCard.Title>
      </GameCard>

      <MyGameCard>
        <GameCard.Image>
          <div className="flex size-full items-center justify-center rounded-[10px] bg-gradient-to-br from-yellow-400 to-orange-500">
            <span className="font-bold text-white">내 게임</span>
          </div>
          <GameCard.Badge className="left-[8px] top-[8px]">
            12문제
          </GameCard.Badge>
          <GameCard.SharedBadge>공유</GameCard.SharedBadge>
        </GameCard.Image>
        <div className="flex h-[46px] w-[178px] items-center justify-between">
          <div className="line-clamp-2 h-[46px] w-[130px] shrink-0 overflow-hidden text-[19px] font-bold leading-[120%] text-text-primary">
            내가 만든 게임
          </div>
          <GameCardOptions
            shared={true}
            onEdit={() => console.log("게임 수정")}
            onShare={() => console.log("게임 공유")}
            onDelete={() => console.log("게임 삭제")}
          />
        </div>
      </MyGameCard>

      <GameCard>
        <GameCard.Image className="h-[260px]">
          <div className="flex size-full items-center justify-center rounded-[10px] bg-gradient-to-br from-purple-400 to-indigo-500">
            <span className="text-lg font-bold text-white">게임 미리보기</span>
          </div>
        </GameCard.Image>
        <GameCard.Title>게임 미리보기 제목</GameCard.Title>
      </GameCard>
    </div>
  ),
}
