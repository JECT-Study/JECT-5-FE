import { DestructiveSolidBoxButton } from "../components/button/destructiveBoxButton"

export default {
  title: "Button/DestructiveSolidBoxButton",
  component: DestructiveSolidBoxButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**DestructiveSolidBoxButton**은 경고나 삭제와 같은 중요한 액션에 사용되는 버튼입니다.

- **용도**: 삭제, 취소, 경고 등의 destructive 액션
- **색상**: 빨간색 계열 (기본: #ff6467, hover: #fb2c36, active: #c10007)
- **상태**: default, hover, active, disabled 상태 지원
- **크기**: xs부터 2xl까지 6가지 크기 제공

⚠️ **주의사항**: 이 버튼은 사용자에게 중요한 결과를 가져올 수 있는 액션에만 사용하세요.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl"],
      description: "버튼의 크기를 설정합니다. xl과 2xl은 고정 너비를 가집니다.",
      table: {
        type: { summary: "xs | sm | md | lg | xl | 2xl" },
        defaultValue: { summary: "md" },
      },
    },
    children: {
      control: "text",
      description: "버튼 내부에 표시될 텍스트입니다.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    disabled: {
      control: "boolean",
      description:
        "버튼의 비활성화 상태를 설정합니다. 비활성화 시 어두운 빨간색(#c10007)으로 표시됩니다.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    onClick: {
      action: "clicked",
      description: "버튼 클릭 시 실행되는 이벤트 핸들러입니다.",
      table: {
        type: { summary: "() => void" },
      },
    },
    className: {
      control: "text",
      description: "추가 CSS 클래스명을 설정합니다.",
      table: {
        type: { summary: "string" },
      },
    },
  },
}

export const Default = {
  args: {
    size: "md",
    children: "삭제하기",
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
기본 DestructiveSolidBoxButton입니다. 

**사용 예시:**
- 파일 삭제
- 계정 탈퇴
- 취소 버튼
- 경고 확인

Controls를 사용하여 다양한 크기와 상태를 테스트해보세요.
        `,
      },
    },
  },
}

export const Interactive = {
  args: {
    size: "lg",
    children: "위험한 작업 실행",
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
**인터랙티브 테스트용 스토리**

이 스토리를 통해 다음을 테스트할 수 있습니다:
- **hover**: 마우스 오버 시 색상 변화 (#fb2c36)
- **active**: 클릭 시 색상 변화 (#c10007)  
- **disabled**: 비활성화 상태 확인
- **크기**: xs부터 2xl까지 모든 크기 테스트

**크기별 특징:**
- xs~lg: 내용에 맞춰 가변 너비
- xl: 고정 너비 452px
- 2xl: 고정 너비 572px
        `,
      },
    },
  },
}
