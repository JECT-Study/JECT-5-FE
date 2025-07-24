import type { Meta, StoryObj } from "@storybook/react-vite"
import { Form } from "radix-ui"

import { Control, ErrorText, Field, Label } from "../components/input"

/**
 * # Input Component
 *
 * 다양한 스타일과 상태를 지원하는 입력 필드 컴포넌트입니다.
 *
 * ## 사용법
 *
 * ```tsx
 * import { Field, Label, Control, ErrorText } from "../components/input"
 * import { Form } from "radix-ui"
 *
 * function MyForm() {
 *   return (
 *     <Form.Root>
 *       <Field type="noIcon" state="default" name="username">
 *         <Label>사용자명</Label>
 *         <Control placeholder="사용자명을 입력하세요" />
 *       </Field>
 *     </Form.Root>
 *   )
 * }
 * ```
 *
 * ## 입력 타입
 * - `leftIcon`: 검색 아이콘이 있는 큰 입력 필드
 * - `noIcon`: 기본 입력 필드
 * - `labelOn`: 라벨이 있는 입력 필드
 * - `reset`: 삭제 버튼이 있는 입력 필드
 */

const meta = {
  title: "Components/Input",
  component: Field,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["leftIcon", "noIcon", "labelOn", "reset"],
      description: "입력 필드의 타입을 선택합니다",
    },
    state: {
      control: { type: "select" },
      options: ["default", "error"],
      description: "입력 필드의 상태를 선택합니다",
    },
    name: {
      control: { type: "text" },
      description: "폼 필드 이름",
    },
  },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const NoIcon: Story = {
  args: {
    type: "noIcon",
    state: "default",
    name: "basic-input",
  },
  render: (args) => (
    <Form.Root>
      <Field {...args}>
        <Control placeholder="텍스트를 입력하세요" />
      </Field>
    </Form.Root>
  ),
}

export const WithLabel: Story = {
  args: {
    type: "labelOn",
    state: "default",
    name: "labeled-input",
  },
  render: (args) => (
    <Form.Root>
      <Field {...args}>
        <Label>라벨명</Label>
        <Control placeholder="라벨이 있는 입력 필드" />
      </Field>
    </Form.Root>
  ),
}

export const WithLeftIcon: Story = {
  args: {
    type: "leftIcon",
    state: "default",
    name: "search-input",
  },
  render: (args) => (
    <Form.Root>
      <Field {...args}>
        <Control placeholder="검색어를 입력하세요" />
      </Field>
    </Form.Root>
  ),
}

export const WithReset: Story = {
  args: {
    type: "reset",
    state: "default",
    name: "reset-input",
  },
  render: (args) => (
    <Form.Root>
      <Field {...args}>
        <Control placeholder="리셋 버튼이 있는 입력 필드" />
      </Field>
    </Form.Root>
  ),
}

export const ErrorState: Story = {
  args: {
    type: "labelOn",
    state: "error",
    name: "error-input",
  },
  render: (args) => (
    <Form.Root>
      <Field {...args}>
        <Label>이메일</Label>
        <Control placeholder="이메일을 입력하세요" />
        <ErrorText>올바른 이메일 주소를 입력해주세요</ErrorText>
      </Field>
    </Form.Root>
  ),
}
