import type { Meta, StoryObj } from "@storybook/react-vite"

import { Question } from "../components/question"

const meta = {
  title: "Components/Question",
  component: Question,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["default", "selected", "error"],
      description: "문제 상태",
    },
    index: {
      control: { type: "number", min: 1, max: 10 },
      description: "문제 순서 (1부터 시작)",
    },
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof Question>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    state: "default",
    index: 1,
    children: "placeholder" as React.ReactNode,
  },
  render: (args) => (
    <Question state={args.state} index={args.index} onClick={args.onClick}>
      <Question.Title>질문 내용이 여기에 표시됩니다</Question.Title>
      <Question.Image />
      <Question.DeleteButton />
      <Question.MoveButtons />
    </Question>
  ),
}

export const Selected: Story = {
  args: {
    state: "selected",
    index: 2,
    children: "placeholder" as React.ReactNode,
  },
  render: (args) => (
    <Question state={args.state} index={args.index} onClick={args.onClick}>
      <Question.Title>
        선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된
        질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된
        질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다선택된
        질문입니다선택된 질문입니다선택된 질문입니다선택된 질문입니다
      </Question.Title>
      <Question.Image />
      <Question.DeleteButton />
      <Question.MoveButtons />
    </Question>
  ),
}

export const ErrorState: Story = {
  args: {
    state: "error",
    index: 3,
    children: "placeholder" as React.ReactNode,
  },
  render: (args) => (
    <Question state={args.state} index={args.index} onClick={args.onClick}>
      <Question.Title>
        질문은 입력되었지만 답안이 입력되지 않은 에러 상태입니다
      </Question.Title>
      <Question.Image />
      <Question.DeleteButton />
      <Question.MoveButtons />
    </Question>
  ),
}

export const SelectedWithError: Story = {
  args: {
    state: "selected",
    index: 4,
    children: "placeholder" as React.ReactNode,
  },
  render: (args) => (
    <Question state={args.state} index={args.index} onClick={args.onClick}>
      <Question.Title>선택된 상태이지만 에러가 있는 질문입니다</Question.Title>
      <Question.Image />
      <Question.DeleteButton />
      <Question.MoveButtons />
    </Question>
  ),
}

export const WithImage: Story = {
  args: {
    state: "default",
    index: 5,
    children: "placeholder" as React.ReactNode,
  },
  render: (args) => (
    <Question state={args.state} index={args.index} onClick={args.onClick}>
      <Question.Title>이미지가 있는 질문입니다</Question.Title>
      <Question.Image>
        <img
          src="/exampleThumbnail.jpg"
          alt="질문 이미지"
          className="size-[78px] rounded-[7px] object-cover"
        />
      </Question.Image>
      <Question.DeleteButton />
      <Question.MoveButtons />
    </Question>
  ),
}

export const CustomActions: Story = {
  args: {
    state: "default",
    index: 6,
    children: "placeholder" as React.ReactNode,
  },
  render: (args) => (
    <Question state={args.state} index={args.index} onClick={args.onClick}>
      <Question.Title>커스텀 액션이 있는 질문</Question.Title>
      <Question.Image />
      <Question.Actions>
        <Question.DeleteButton canDelete={false} />
        <Question.MoveButtons />
      </Question.Actions>
    </Question>
  ),
}
