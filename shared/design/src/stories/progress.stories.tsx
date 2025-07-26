import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import { Progress } from "../components/progress"

const meta = {
  title: "Components/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# Progress Component

진행률을 표시하는 컴포넌트입니다. Radix UI Progress를 기반으로 구축되었습니다.

## 사용법

\`\`\`tsx
import { Progress } from "@/components/progress"

function MyComponent() {
  return (
    <Progress value={75} />
  )
}
\`\`\`

## Props

- \`value\`: 진행률 값 (0-100)
- \`className\`: 추가 CSS 클래스
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "진행률 값 (0-100)",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "0" },
      },
    },
    className: {
      control: { type: "text" },
      description: "추가 CSS 클래스명",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
  },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 50,
  },
}

export const Empty: Story = {
  args: {
    value: 0,
  },
}

export const Full: Story = {
  args: {
    value: 100,
  },
}

export const Low: Story = {
  args: {
    value: 25,
  },
}

export const High: Story = {
  args: {
    value: 75,
  },
}

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = React.useState(30)

    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600">진행률: {value}%</div>
        <Progress value={value} />
        <div className="flex gap-2">
          <button
            onClick={() => setValue(Math.max(0, value - 10))}
            className="rounded bg-blue-500 px-3 py-1 text-sm text-white"
          >
            -10%
          </button>
          <button
            onClick={() => setValue(Math.min(100, value + 10))}
            className="rounded bg-blue-500 px-3 py-1 text-sm text-white"
          >
            +10%
          </button>
        </div>
      </div>
    )
  },
}
