import type { Meta, StoryObj } from "@storybook/react-vite"

import { GameCard } from "../components/gameCard"

type StorybookGameCardProps = {
  type: "libraryGame" | "myGame" | "gamePreview" | "onlyTitleGamePreview"
  title: string
  questionCount: number
  imageUrl?: string
  optionView?: boolean
  onEdit?: () => void
  onShare?: () => void
  onDelete?: () => void
  onMoreClick?: () => void
}

const meta: Meta<StorybookGameCardProps> = {
  title: "Components/GameCard",
  component: GameCard as React.ComponentType<StorybookGameCardProps>,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["libraryGame", "myGame", "gamePreview", "onlyTitleGamePreview"],
    },
    title: {
      control: { type: "text" },
    },
    questionCount: {
      control: { type: "number" },
    },
    imageUrl: {
      control: { type: "text" },
    },
    optionView: {
      control: { type: "boolean" },
      if: { arg: 'type', eq: 'myGame' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const LibraryGame: Story = {
  args: {
    type: "libraryGame",
    title: "수학 퀴즈 게임",
    questionCount: 10,
    imageUrl: "https://picsum.photos/id/237/536/354",
  },
}

export const MyGame: Story = {
  args: {
    type: "myGame",
    title: "내가 만든 게임",
    questionCount: 15,
    imageUrl: "https://picsum.photos/id/237/536/354",
    optionView: false,
  },
}

export const GamePreview: Story = {
  args: {
    type: "gamePreview",
    title: "게임 프리뷰",
    questionCount: 8,
    imageUrl: "https://picsum.photos/id/237/536/354",
  },
}

export const OnlyTitleGamePreview: Story = {
  args: {
    type: "onlyTitleGamePreview",
    title: "제목만 있는 게임",
    questionCount: 5,
  },
}

export const LongTitle: Story = {
  args: {
    type: "libraryGame",
    title: "매우 긴 제목의 게임입니다. 이 제목은 두 줄로 표시되어야 합니다.",
    questionCount: 20,
    imageUrl: "https://picsum.photos/id/237/536/354",
  },
}

export const NoImage: Story = {
  args: {
    type: "libraryGame",
    title: "이미지 없는 게임",
    questionCount: 12,
  },
}