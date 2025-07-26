import type { Meta, StoryObj } from "@storybook/react-vite"
import { Form } from "radix-ui"
import * as React from "react"

import { Control, ErrorText, Field, Label } from "../components/input"

const meta = {
  title: "Components/Input",
  component: Field,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# Input Component

**Radix UI Form**을 기반으로 구축된 폼 입력 필드 컴포넌트입니다. 다양한 스타일과 상태를 지원하며, 접근성과 사용자 경험을 고려하여 설계되었습니다.

## 🏗️ Radix UI Form 기반 구조

이 컴포넌트는 **Radix UI Form**을 활용하여 구현되었습니다:

- **Form.Root**: HTML form 태그를 렌더링하는 폼의 루트 컨테이너
- **Form.Field**: 개별 필드 컨테이너
- **Form.Label**: 접근성을 고려한 label 태그
- **Form.Control**: 실제 input 태그를 래핑하는 요소
- **Form.Message**: 에러 메시지를 표시하는 요소

## 컴포넌트 구성요소

### 🧩 합성 컴포넌트 패턴
- **Root**: Form.Root (HTML form 태그)
- **Field**: 폼 필드 컨테이너, 타입과 상태 관리
- **Label**: 접근성을 위한 HTML label 태그 컴포넌트
- **Control**: 실제 HTML input 태그, 제어된 상태 관리
- **ErrorText**: 에러 메시지 표시 요소

## 입력 타입별 특징

### 🔍 leftIcon (검색 입력)
- 크기: 871px × 64px (대형 검색 필드)
- 좌측 검색 아이콘 포함
- 검색 인터페이스에 최적화

### 📝 noIcon (기본 입력)
- 크기: 320px (컴팩트 사이즈)
- 아이콘 없는 깔끔한 디자인
- 일반적인 텍스트 입력에 적합

### 🏷️ labelOn (라벨 포함)
- 크기: 452px
- 상단 라벨과 입력 필드 조합
- 폼 필드에 최적화된 레이아웃

### 🔄 reset (리셋 버튼)
- 크기: 452px
- 우측 삭제 버튼 포함
- 입력 내용 즉시 삭제 가능

## 상태 관리

### 🎯 제어된/비제어된 컴포넌트
- **useControllableState** (Radix UI)를 사용한 상태 관리
- 제어된 모드와 비제어된 모드 모두 지원

**Props 타입:**
- \`value?: string\` - 제어된 모드에서 현재 입력값
- \`defaultValue?: string\` - 비제어된 모드에서 초기 입력값  
- \`onChange?: (value: string) => void\` - 입력값이 변경될 때 호출되는 함수

**사용 모드:**
- **제어**: \`value\`와 \`onChange\`를 모두 제공하여 외부에서 상태 관리
- **비제어**: \`defaultValue\`만 제공하거나 아무것도 제공하지 않아 내부에서 상태 관리

### 🎨 상태별 스타일링
- **default**: 기본 상태 (포커스 시 파란색 테두리)
- **error**: 에러 상태 (빨간색 테두리, 에러 메시지)

## 기본 사용법

\`\`\`tsx
import { Field, Label, Control, ErrorText, Root } from "@/components/input"

function MyForm() {
  const [value, setValue] = React.useState("")
  
  return (
    <Root>
      <Field type="labelOn" state="default" name="username">
        <Label>사용자명</Label>
        <Control 
          value={value}
          onChange={setValue}
          placeholder="사용자명을 입력하세요" 
        />
        <ErrorText>사용자명은 필수 입력 항목입니다</ErrorText>
      </Field>
    </Root>
  )
}
\`\`\`

## ⚠️ 주의사항

**Root는 필수로 사용해야 합니다**

모든 Input 컴포넌트는 반드시 \`Root\` (Form.Root) 컴포넌트로 감싸야 합니다:

\`\`\`tsx
// ✅ 올바른 사용법
<Root>
  <Field type="noIcon" state="default" name="input">
    <Control value={value} onChange={setValue} />
  </Field>
</Root>

// ❌ 잘못된 사용법 - Root 없이 사용
<Field type="noIcon" state="default" name="input">
  <Control value={value} onChange={setValue} />
</Field>
\`\`\`

## 접근성 특징

- **Radix UI Form**의 접근성 기능 활용
- 스크린 리더 지원
- 키보드 네비게이션 완전 지원
- ARIA 속성 자동 설정
- 에러 메시지와 필드 연결

## 디자인 토큰

CVA(Class Variance Authority)를 사용한 일관된 스타일링으로 디자인 시스템과 완벽히 통합됩니다.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["leftIcon", "noIcon", "labelOn", "reset"],
      description: "입력 필드의 타입을 선택합니다",
      table: {
        type: { summary: "'leftIcon' | 'noIcon' | 'labelOn' | 'reset'" },
        defaultValue: { summary: "undefined" },
      },
    },
    state: {
      control: { type: "select" },
      options: ["default", "error"],
      description: "입력 필드의 상태를 선택합니다",
      table: {
        type: { summary: "'default' | 'error'" },
        defaultValue: { summary: "'default'" },
      },
    },
    name: {
      control: { type: "text" },
      description: "폼 필드 이름 (Form.Field의 name 속성)",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
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
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const NoIcon: Story = {
  parameters: {
    docs: {
      description: {
        story: `
기본적인 입력 필드입니다. 아이콘 없이 깔끔한 디자인으로 일반적인 텍스트 입력에 적합합니다.

**특징:**
- 320px 컴팩트 사이즈
- 아이콘 없는 미니멀 디자인
- Radix UI Form.Control 기반 접근성
        `,
      },
    },
  },
  args: {
    type: "noIcon",
    state: "default",
    name: "basic-input",
  },
  render: (args) => {
    const [value, setValue] = React.useState("")

    return (
      <Form.Root>
        <Field {...args}>
          <Control
            value={value}
            onChange={(value) => setValue(value)}
            placeholder="텍스트를 입력하세요"
          />
        </Field>
      </Form.Root>
    )
  },
}

export const WithLabel: Story = {
  parameters: {
    docs: {
      description: {
        story: `
라벨이 포함된 입력 필드입니다. 폼에서 각 필드의 목적을 명확히 표시할 때 사용합니다.

**특징:**
- 452px 표준 사이즈
- 상단 라벨로 명확한 필드 식별
- Radix UI Form.Label로 접근성 보장
- 라벨과 입력 필드 자동 연결
        `,
      },
    },
  },
  args: {
    type: "labelOn",
    state: "default",
    name: "labeled-input",
  },
  render: (args) => {
    const [value, setValue] = React.useState("")

    return (
      <Form.Root>
        <Field {...args}>
          <Label>사용자명</Label>
          <Control
            value={value}
            onChange={(value) => setValue(value)}
            placeholder="사용자명을 입력해주세요"
          />
        </Field>
      </Form.Root>
    )
  },
}

export const WithLeftIcon: Story = {
  parameters: {
    docs: {
      description: {
        story: `
검색 아이콘이 포함된 대형 입력 필드입니다. 검색 인터페이스나 대형 입력이 필요한 경우에 사용합니다.

**특징:**
- 871px × 64px 대형 사이즈
- 좌측 검색(Magnifier) 아이콘
- 검색 UI에 최적화된 디자인
- 넓은 입력 영역으로 긴 텍스트 입력 지원
        `,
      },
    },
  },
  args: {
    type: "leftIcon",
    state: "default",
    name: "search-input",
  },
  render: (args) => {
    const [value, setValue] = React.useState("")

    return (
      <Form.Root>
        <Field {...args}>
          <Control
            value={value}
            onChange={setValue}
            placeholder="검색어를 입력하세요"
          />
        </Field>
      </Form.Root>
    )
  },
}

export const WithReset: Story = {
  parameters: {
    docs: {
      description: {
        story: `
삭제 버튼이 포함된 입력 필드입니다. 사용자가 입력 내용을 빠르게 지울 수 있는 기능을 제공합니다.

**특징:**
- 452px 표준 사이즈
- 우측 삭제(Trash) 버튼
- 클릭 시 입력 내용 즉시 삭제
- DestructiveSolidIconButton 컴포넌트 활용
        `,
      },
    },
  },
  args: {
    type: "reset",
    state: "default",
    name: "reset-input",
  },
  render: (args) => {
    const [value, setValue] = React.useState("")

    return (
      <Form.Root>
        <Field {...args}>
          <Control
            value={value}
            onChange={setValue}
            placeholder="리셋 버튼이 있는 입력 필드"
          />
        </Field>
      </Form.Root>
    )
  },
}

export const ErrorState: Story = {
  parameters: {
    docs: {
      description: {
        story: `
에러 상태의 입력 필드입니다. 유효성 검사 실패 시 사용자에게 명확한 피드백을 제공합니다.

**특징:**
- 빨간색 테두리로 에러 표시
- Form.Message를 통한 에러 메시지
- 접근성을 고려한 에러 메시지 연결
- 포커스 시에도 에러 상태 유지
        `,
      },
    },
  },
  args: {
    type: "labelOn",
    state: "error",
    name: "error-input",
  },
  render: (args) => {
    const [value, setValue] = React.useState("invalid-email")

    return (
      <Form.Root>
        <Field {...args}>
          <Label>이메일</Label>
          <Control
            value={value}
            onChange={setValue}
            placeholder="이메일을 입력하세요"
          />
          <ErrorText>올바른 이메일 주소를 입력해주세요</ErrorText>
        </Field>
      </Form.Root>
    )
  },
}

export const ControlledInput: Story = {
  parameters: {
    docs: {
      description: {
        story: `
제어된 컴포넌트로 사용하는 예시입니다. 외부 상태와 연동하여 입력값을 관리할 수 있습니다.

**특징:**
- React.useState를 통한 상태 관리
- value와 onChange props 활용
- useControllableState (Radix UI) 내부 사용
- 제어된/비제어된 모드 모두 지원
        `,
      },
    },
  },
  args: {
    type: "labelOn",
    state: "default",
    name: "controlled-input",
  },
  render: (args) => {
    const [value, setValue] = React.useState("초기값")

    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          현재 입력값: <strong>{value || "비어있음"}</strong>
        </div>
        <Form.Root>
          <Field {...args}>
            <Label>제어된 입력 필드</Label>
            <Control
              value={value}
              onChange={setValue}
              placeholder="값을 입력해보세요"
            />
          </Field>
        </Form.Root>
        <button
          className="rounded bg-blue-500 px-3 py-1 text-sm text-white"
          onClick={() => setValue("")}
        >
          초기화
        </button>
      </div>
    )
  },
}
