import type { Meta, StoryObj } from "@storybook/react-vite"

import { RadioField } from "../components/radioField"

const meta: Meta<typeof RadioField> = {
  title: "components/RadioField",
  component: RadioField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
# RadioField

native \`<input type="radio">\` 기반의 라디오 필드 컴포넌트입니다.  
라벨은 **children slot**으로 열려 있어 텍스트/설명/링크 등 원하는 구조로 조합할 수 있습니다.

## 사용법

\`\`\`tsx
import { RadioField } from "@ject-5-fe/design/components/radioField"

export function Example() {
  return (
    <RadioField name="historical-figures" defaultChecked value="sojourner-truth">
      <span className="typography-heading-sm-semibold text-text-interactive-input-filled">
        Sojourner Truth
      </span>
    </RadioField>
  )
}
\`\`\`

## 라디오 그룹 사용 (중요)

라디오는 같은 \`name\`을 공유하는 input끼리 한 그룹으로 동작합니다.

\`\`\`tsx
<RadioField name="group" value="a" defaultChecked>...</RadioField>
<RadioField name="group" value="b">...</RadioField>
\`\`\`

## 제어형(Controlled)

\`\`\`tsx
import { useState } from "react"
import { RadioField } from "@ject-5-fe/design/components/radioField"

export function ControlledExample() {
  const [value, setValue] = useState<"a" | "b">("a")

  return (
    <>
      <RadioField
        name="group"
        value="a"
        checked={value === "a"}
        onCheckedChange={() => setValue("a")}
      >
        <span className="typography-heading-sm-semibold text-text-interactive-input-filled">
          A
        </span>
      </RadioField>

      <RadioField
        name="group"
        value="b"
        checked={value === "b"}
        onCheckedChange={() => setValue("b")}
      >
        <span className="typography-heading-sm-semibold text-text-interactive-input-filled">
          B
        </span>
      </RadioField>
    </>
  )
}
\`\`\`

## Active(halo) 동작

Figma의 active halo는 **클릭(press) 중에만** 보이도록 구현되어 있습니다.  
(\`group-active\` 기반: mouse down / pointer down 동안 표시)

## 스타일 확장
- \`containerClassName\`: 라벨 래퍼(\`<label>\`)에 추가 클래스
- \`className\`: 숨겨진 \`<input>\`에 추가 클래스

## 접근성
- native radio + label 연결(\`htmlFor/id\`)을 사용합니다.
- 시각적 장식(UI)은 \`aria-hidden\` 처리되어 스크린리더가 불필요한 장식을 읽지 않습니다.
        `,
      },
    },
  },
  args: {
    children: (
      <span className="typography-heading-sm-semibold text-text-interactive-input-filled">
        폭력적이거나 불편한 컨텐츠
      </span>
    ),
  },
}

export default meta

type Story = StoryObj<typeof RadioField>

export const Checked: Story = {
  args: { defaultChecked: true, disabled: false },
}

export const CheckedDisabled: Story = {
  args: { defaultChecked: true, disabled: true },
}

export const Unchecked: Story = {
  args: { defaultChecked: false, disabled: false },
}

export const UncheckedDisabled: Story = {
  args: { defaultChecked: false, disabled: true },
}
