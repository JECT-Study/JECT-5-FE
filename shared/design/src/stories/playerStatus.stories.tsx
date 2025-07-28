import type { Meta, StoryObj } from "@storybook/react-vite"

import { PlayerStatus } from "../components/playerStatus"

const meta = {
  title: "Components/PlayerStatus",
  component: PlayerStatus,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PlayerStatus>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: "A팀",
    score: "0점",
    scoreView: true,
  },
}

export const WithoutScore: Story = {
  args: {
    name: "B팀dddddddddddddddddddddddddd",
    score: "0점",
    scoreView: false,
  },
}

export const WithScore: Story = {
  args: {
    name: "C팀",
    score: "5점",
    scoreView: true,
  },
}
