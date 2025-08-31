import type { Meta, StoryObj } from "@storybook/react-vite"

import { Question } from "../components/question"

interface StoryArgs {
  state: "default" | "selected" | "error"
  index?: number
  onClick?: () => void
  title?: string
  image?: string
  canDelete?: boolean
  onDelete?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  customActions?: React.ReactNode
}

const meta = {
  title: "Components/Question",
  component: Question,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## 🎯 Question 컴포넌트 - 게임 질문 카드

게임 생성 시 사용되는 질문 카드 컴포넌트입니다. **Compound Component Pattern**을 사용하여 유연한 구성이 가능합니다.

### 🏗️ 주요 특징

- **Radix UI 기반**: BaseButton(Slot 기반)을 사용한 안정적인 접근성
- **순서 기반 접근성**: \`index\` prop으로 "n번째 문제" 자동 라벨링
- **동적 상태 관리**: 실시간 상태 변경 및 에러 처리 지원
- **유연한 구성**: Title, Image, Actions를 자유롭게 조합 가능

### 📱 언제 사용하나요?

- **게임 생성 화면**: 질문 목록 표시 및 편집
- **질문 관리**: 순서 변경, 삭제, 상태 관리
- **에러 처리**: 필수 입력 누락 시 시각적 피드백

### ⚠️ 주의사항

- \`index\` prop은 1부터 시작 (배열 index + 1)
- 마지막 질문은 \`canDelete={false}\`로 삭제 방지 필요
- 이미지는 78×78px 권장, shared/design에서는 일반 img 태그 사용

### 🔗 관련 컴포넌트

- \`DestructiveSolidIconButton\`: 삭제 버튼
- \`SecondaryPlainIconButton\`: 이동 버튼들
- \`QuestionList\`: 여러 질문을 관리하는 상위 컴포넌트

### 🔄 Figma 디자인 대비 주요 변경사항

#### 1. **Compound Component Pattern 도입**
**변경 전 (Figma)**: 6개 고정 배리언트 (\`state × image\` 조합)  
**변경 후 (현재)**: 유연한 조합 가능한 합성 컴포넌트

\`\`\`typescript
// Figma: 고정된 배리언트
<QuestionComponent variant="state=selected,image=true" />

// 현재: 자유로운 구성
<Question state="selected" index={1}>
  <Question.Title>커스텀 제목</Question.Title>
  <Question.Image>
    <CustomImage />
  </Question.Image>
  <Question.Actions>
    <CustomButton />  // 사용자 정의 액션 추가 가능
  </Question.Actions>
</Question>
\`\`\`

#### 2. **순서 기반 접근성 시스템**
**추가된 기능**: \`index\` prop으로 자동 접근성 라벨 생성
- Question 카드: \`aria-label="n번째 문제"\`
- 삭제 버튼: \`aria-label="n번째 문제 삭제"\`
- 이동 버튼: \`aria-label="n번째 문제 위로/아래로 이동"\`

#### 3. **이미지 처리 방식 개선**
**변경 전**: \`image={true/false}\` 고정 속성  
**변경 후**: 유연한 이미지 주입 시스템

\`\`\`typescript
// 일반 img 태그 (shared/design)
<Question.Image>
  <img src="/image.jpg" alt="설명" className="size-[78px]" />
</Question.Image>

// Next.js Image 주입 가능 (service/app)
<Question.Image>
  <Image src="/image.jpg" width={78} height={78} />
</Question.Image>

// 커스텀 fallback 지원
<Question.Image fallback={<CustomPlaceholder />} />
\`\`\`

#### 4. **동적 상태 관리**
**추가된 기능**: 런타임 상태 변경 및 인터랙션 지원
- \`onClick\` 이벤트로 편집 모드 전환
- \`canDelete\` prop으로 동적 삭제 제한
- 실시간 에러 상태 반영 (\`state="error"\`)
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["default", "selected", "error"],
      description:
        "**문제 상태**\n- `default`: 기본 상태\n- `selected`: 현재 편집 중\n- `error`: 입력 누락/검증 실패",
    },
    index: {
      control: { type: "number", min: 1, max: 10 },
      description:
        '**문제 순서** (1부터 시작)\n- 접근성 라벨 자동 생성: "n번째 문제"\n- 버튼 라벨에도 반영: "n번째 문제 삭제"',
    },
    onClick: {
      action: "clicked",
      description:
        "**클릭 이벤트**\n- 질문 선택 시 호출\n- 편집 모드 전환 등에 활용",
    },
  },
} satisfies Meta<typeof Question>

export default meta
type Story = StoryObj<StoryArgs>

const Template = (args: StoryArgs) => (
  <Question state={args.state} index={args.index} onClick={args.onClick}>
    <Question.Title>{args.title}</Question.Title>
    {args.image ? (
      <Question.Image>
        <img
          src={args.image}
          alt="문제 이미지"
          className="size-[78px] rounded-[7px] object-cover"
        />
      </Question.Image>
    ) : (
      <Question.Image />
    )}
    {args.customActions ? (
      <Question.Actions>{args.customActions}</Question.Actions>
    ) : (
      <>
        <Question.DeleteButton
          canDelete={args.canDelete}
          onDelete={args.onDelete}
        />
        <Question.MoveButtons
          onMoveUp={args.onMoveUp}
          onMoveDown={args.onMoveDown}
        />
      </>
    )}
  </Question>
)

export const BasicTextQuestion: Story = {
  args: {
    state: "default",
    index: 1,
    title: "사용자의 취미는 무엇인가요?",
    canDelete: true,
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          "**가장 기본적인 질문 카드**입니다. 이미지 없이 텍스트만으로 구성됩니다.",
      },
    },
  },
}

export const CurrentlyEditing: Story = {
  args: {
    state: "selected",
    index: 2,
    title: "가장 좋아하는 음식을 설명해 주세요",
    canDelete: true,
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          "**현재 편집 중인 상태**입니다. 사용자가 질문을 선택했을 때 나타나는 시각적 피드백을 보여줍니다.",
      },
    },
  },
}

export const ValidationError: Story = {
  args: {
    state: "error",
    index: 3,
    title: "문제를 입력해주세요",
    canDelete: true,
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          "**검증 실패 상태**입니다. 필수 입력이 누락되거나 유효하지 않은 질문일 때 표시됩니다. 제목 앞에 ❗ 아이콘이 자동으로 추가됩니다.",
      },
    },
  },
}

export const QuestionWithImage: Story = {
  args: {
    state: "default",
    index: 4,
    title: "이 이미지에서 무엇을 보시나요?",
    image: "/exampleThumbnail.jpg",
    canDelete: true,
  },
  render: Template,
}

export const LastRequiredQuestion: Story = {
  args: {
    state: "default",
    index: 1,
    title: "최소 하나의 문제은 필요합니다",
    canDelete: false,
  },
  render: Template,
}

export const GameCreationScenario: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "**실제 게임 생성 시나리오**입니다. 여러 질문이 함께 있을 때의 모습과 다양한 상태를 한 번에 확인할 수 있습니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <h3 className="mb-4 text-lg font-semibold">게임 문제 목록</h3>

      <Question state="selected" index={1}>
        <Question.Title>편집중인 문제</Question.Title>
        <Question.Image />
        <Question.DeleteButton canDelete={true} />
        <Question.MoveButtons />
      </Question>

      <Question state="default" index={2}>
        <Question.Title>작성된 문제</Question.Title>
        <Question.Image>
          <img
            src="/exampleThumbnail.jpg"
            alt="문제 이미지"
            className="size-[78px] rounded-[7px] object-cover"
          />
        </Question.Image>
        <Question.DeleteButton canDelete={true} />
        <Question.MoveButtons />
      </Question>

      <Question state="error" index={3}>
        <Question.Title>문제를 입력해주세요</Question.Title>
        <Question.Image />
        <Question.DeleteButton canDelete={true} />
        <Question.MoveButtons />
      </Question>
    </div>
  ),
}

export const WithClickAction: Story = {
  args: {
    state: "default",
    index: 1,
    title: "클릭해서 편집 모드로 전환",
    canDelete: true,
    onClick: () => alert("문제가 선택되었습니다!"),
  },
  render: Template,
}

export const WithMoveActions: Story = {
  args: {
    state: "default",
    index: 2,
    title: "위/아래 이동 버튼 테스트",
    canDelete: true,
    onMoveUp: () => alert("위로 이동!"),
    onMoveDown: () => alert("아래로 이동!"),
  },
  render: Template,
}

export const CustomActions: Story = {
  args: {
    state: "default",
    index: 1,
    title: "커스텀 액션 버튼들",
    customActions: (
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button className="rounded bg-blue-500 px-3 py-1 text-sm text-white">
          복사
        </button>
        <button className="rounded bg-green-500 px-3 py-1 text-sm text-white">
          저장
        </button>
      </div>
    ),
  },
  render: Template,
}

export const LongTextQuestion: Story = {
  args: {
    state: "default",
    index: 1,
    title:
      "이것은 매우 긴 질문 제목입니다. 텍스트가 너무 길어서 한 줄을 넘어가는 경우에 어떻게 처리되는지 확인하기 위한 예시입니다.",
    canDelete: true,
  },
  render: Template,
}
