import type { Meta, StoryObj } from "@storybook/react-vite"

import { Checkbox } from "../components/checkBox"

const meta: Meta<typeof Checkbox> = {
  title: "components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
# Checkbox

native \`<input type="checkbox">\` 기반의 체크박스 컴포넌트입니다.  
라벨은 **children slot**으로 열려 있어, 텍스트/링크/설명 등 원하는 구조로 조합할 수 있습니다.

## 사용법

\`\`\`tsx
import { Checkbox } from "@ject-5-fe/design/components/checkBox"

export function Example() {
  return (
    <Checkbox defaultChecked name="terms">
      <span className="typography-heading-sm-medium text-text-primary">
        약관 동의
      </span>
    </Checkbox>
  )
}
\`\`\`

## 제어형(Controlled)

\`\`\`tsx
import { useState } from "react"
import { Checkbox } from "@ject-5-fe/design/components/checkBox"

export function ControlledExample() {
  const [checked, setChecked] = useState(false)

  return (
    <Checkbox checked={checked} onCheckedChange={setChecked}>
      <span className="typography-heading-sm-medium text-text-primary">
        알림 받기
      </span>
    </Checkbox>
  )
}
\`\`\`

## 폼 제출

\`\`\`tsx
<form
  onSubmit={(e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    console.log(fd.get("marketing")) // checked면 "on"
  }}
>
  <Checkbox name="marketing" defaultChecked>
    <span className="typography-heading-sm-medium text-text-primary">
      마케팅 수신 동의
    </span>
  </Checkbox>
</form>
\`\`\`

## 스타일 확장
- \`containerClassName\`: 라벨 래퍼(\`<label>\`)에 추가 클래스
- \`className\`: 숨겨진 \`<input>\`에 추가 클래스

## 접근성
- native checkbox + label 연결(\`htmlFor/id\`)을 사용합니다.
- 아이콘/박스 UI는 \`aria-hidden\` 처리되어 스크린리더가 불필요한 장식을 읽지 않습니다.
        `,
      },
    },
  },
  args: {
    children: (
      <span className="typography-heading-sm-medium text-text-primary">
        CheckBox
      </span>
    ),
  },
}

export default meta

type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {
    defaultChecked: false,
    disabled: false,
  },
}

export const Checked: Story = {
  args: {
    defaultChecked: true,
    disabled: false,
  },
}

export const Disabled: Story = {
  args: {
    defaultChecked: false,
    disabled: true,
  },
}

export const CheckedDisabled: Story = {
  args: {
    defaultChecked: true,
    disabled: true,
  },
}

export const WithChildren: Story = {
  args: {
    defaultChecked: true,
    disabled: false,
  },
  render: (args) => (
    <Checkbox {...args}>
      <span className="typography-heading-sm-medium text-text-primary">
        약관 동의 (children slot)
      </span>
    </Checkbox>
  ),
}
