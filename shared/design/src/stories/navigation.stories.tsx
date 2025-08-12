import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  SecondaryGhostIconButton,
  SecondaryOutlineBoxButton,
} from "../components/button"
import { Navigation } from "../components/navigation"
import { Magnifier, Sun } from "../icons"

const meta: Meta<typeof Navigation> = {
  title: "Components/Navigation",
  component: Navigation,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Navigation Component

레이아웃만 담당하는 네비게이션 컴포넌트입니다. 실제 기능은 사용하는 쪽에서 구현하며, 레이아웃과 스타일링만 제공합니다.

## 🏗️ 컴포넌트 구조

이 컴포넌트는 세 개의 섹션으로 구성됩니다:

- **Left Section**: 로고나 왼쪽 콘텐츠 (420px 고정)
- **Center Section**: 제목, 검색바, 진행률 등 중앙 콘텐츠
- **Right Section**: 버튼들, 아바타 등 오른쪽 콘텐츠 (420px 고정)

## 🎮 타입별 특징

### 📚 untitle (제목 없음)
- **중앙 섹션**: 숨김
- **사용처**: 홈페이지, 기본 네비게이션

### 📝 title (제목 있음)
- **중앙 섹션**: 제목 표시 (1080px)
- **사용처**: 내 게임 페이지, 게임 종료 페이지

### 🔍 searchbar (검색바)
- **중앙 섹션**: 검색 입력창 (871px × 64px)
- **사용처**: 게임 라이브러리, 검색 페이지

### 🎯 createGame (게임 생성)
- **중앙 섹션**: 숨김
- **배경**: background-tertiary
- **사용처**: 게임 생성 페이지

### 🚀 startGame (게임 시작)
- **중앙 섹션**: 제목 표시 (1080px)
- **배경**: background-tertiary
- **사용처**: 게임 시작 설정 페이지

### 📊 progressbar (진행률)
- **중앙 섹션**: 진행률 표시 (1080px)
- **사용처**: 게임 진행 중 페이지

### 🎮 onGame (게임 중)
- **중앙 섹션**: 제목 표시 (1080px)
- **사용처**: 게임 진행 중 페이지

## 🎨 사용법

\`\`\`tsx
import { Navigation } from "@shared/design/src/components/navigation"

// 검색바가 있는 네비게이션
<Navigation
  type="searchbar"
  playGame={false}
  leftContent={<Logo />}
  centerContent={<SearchBar />}
  rightContent={<LoginButton />}
/>

// 제목이 있는 네비게이션
<Navigation
  type="title"
  playGame={false}
  leftContent={<Logo />}
  centerContent={<h1>내 게임</h1>}
  rightContent={<UserMenu />}
/>
\`\`\`

## ⚠️ 주의사항

### 🎯 레이아웃 전용 컴포넌트
- 실제 기능은 사용하는 쪽에서 구현
- 콘텐츠는 props로 전달
- 로직은 포함하지 않음

### 📏 고정 크기
- 전체 높이: 110px
- 좌우 섹션: 각각 420px
- 중앙 섹션: 타입에 따라 다름

### 🎨 디자인 토큰
- 모든 색상과 간격은 디자인 시스템 기반
- Figma와 완벽히 동기화
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: [
        "untitle",
        "title",
        "searchbar",
        "createGame",
        "startGame",
        "progressbar",
        "onGame",
      ],
    },
    playGame: {
      control: { type: "boolean" },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// 기본 로고 컴포넌트
const Logo = () => (
  <div className="flex h-[60px] w-[268px] cursor-pointer items-center justify-center p-3.5">
    <div className="flex size-full items-center justify-center rounded bg-gray-200">
      <span className="font-bold text-gray-600">LOGO</span>
    </div>
  </div>
)

// 기본 검색바 컴포넌트
const SearchBar = () => (
  <div className="flex size-full items-center gap-2 rounded-[5px] border border-border-interactive-input-default bg-background-interactive-input-primary px-5">
    <Magnifier className="size-4 text-icon-interactive-input-default" />
    <input
      type="text"
      placeholder="오늘의 추천 게임은?"
      className="flex-1 text-[19px] font-medium leading-[120%] text-text-primary placeholder:text-text-interactive-input-placeholder focus:outline-none"
    />
  </div>
)

// 기본 로그인 버튼
const LoginButton = () => (
  <>
    <SecondaryOutlineBoxButton size="md">
      <div className="size-8 rounded bg-yellow-400" />
      간편로그인해서 게임 만들기
    </SecondaryOutlineBoxButton>
    <SecondaryGhostIconButton>
      <Sun />
    </SecondaryGhostIconButton>
  </>
)

// 기본 제목
const Title = ({ children }: { children: string }) => (
  <h1 className="text-[28px] font-semibold leading-[120%] text-text-primary">
    {children}
  </h1>
)

// 기본 진행률
const ProgressBar = () => (
  <div className="flex h-[25px] w-[1080px] overflow-hidden rounded-full bg-background-progressbar-secondary">
    <div className="h-full w-[120px] rounded-full bg-background-badge-primary" />
  </div>
)

export const SearchBarNavigation: Story = {
  args: {
    type: "searchbar",
    playGame: false,
    leftContent: <Logo />,
    centerContent: <SearchBar />,
    rightContent: <LoginButton />,
  },
}

export const TitleNavigation: Story = {
  args: {
    type: "title",
    playGame: false,
    leftContent: <Logo />,
    centerContent: <Title>내 게임</Title>,
    rightContent: <LoginButton />,
  },
}

export const UntitleNavigation: Story = {
  args: {
    type: "untitle",
    playGame: false,
    leftContent: <Logo />,
    rightContent: <LoginButton />,
  },
}

export const CreateGameNavigation: Story = {
  args: {
    type: "createGame",
    playGame: false,
    leftContent: <Logo />,
    rightContent: <LoginButton />,
  },
}

export const StartGameNavigation: Story = {
  args: {
    type: "startGame",
    playGame: true,
    leftContent: <Logo />,
    centerContent: <Title>참가자 설정</Title>,
    rightContent: <LoginButton />,
  },
}

export const ProgressBarNavigation: Story = {
  args: {
    type: "progressbar",
    playGame: true,
    leftContent: <Logo />,
    centerContent: <ProgressBar />,
    rightContent: <LoginButton />,
  },
}

export const OnGameNavigation: Story = {
  args: {
    type: "onGame",
    playGame: true,
    leftContent: <Logo />,
    centerContent: <Title>게임 종료</Title>,
    rightContent: <LoginButton />,
  },
}
