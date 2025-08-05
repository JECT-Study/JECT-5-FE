import type { Meta, StoryObj } from "@storybook/react-vite"

import { GameCreate } from "../components/gameCreate"

const meta = {
  title: "Components/GameCreate",
  component: GameCreate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof GameCreate>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}