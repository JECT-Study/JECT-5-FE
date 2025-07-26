import type { Meta, StoryObj } from "@storybook/react-vite"

import { Question } from "../components/question"

const meta = {
  title: "Components/Question",
  component: Question,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Question>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "질문 내용이 여기에 표시됩니다",
    state: "default",
  },
}

export const Selected: Story = {
  args: {
    title:
      "선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다",
    state: "selected",
  },
}

export const Error: Story = {
  args: {
    title:
      "선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다",
    state: "error",
  },
}
