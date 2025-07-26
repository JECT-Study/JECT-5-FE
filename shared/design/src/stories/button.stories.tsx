import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  DestructiveSolidBoxButton,
  PrimaryBoxButton,
  PrimarySolidIconButton,
  SecondaryGhostIconButton,
  SecondaryOutlineBoxButton,
  SecondaryPlainBoxButton,
  SecondaryPlainIconButton,
} from "../components/button"
import {
  Add,
  Arrow,
  Cross,
  Edit,
  Hidden,
  Iconplaceholder_24px,
  Magnifier,
  Minus,
  MoreDot,
  Play,
  Show,
  Sun,
  Trash,
  Unshare,
  Upload,
} from "../icons"

const meta = {
  title: "Components/Button",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# Button Component System

버튼 컴포넌트는 **위계 > 스타일 > 형태** 구조로 체계적으로 설계되었습니다. 
모든 버튼은 **Figma 디자인 시스템**과 완벽히 동기화되어 있어, 디자인과 개발 간의 일관성을 보장합니다.

## 🏗️ 네이밍 컨벤션

모든 버튼 컴포넌트 네이밍은 \`[위계][스타일][형태] + Button\` 형식으로 구성됩니다:

### 📊 위계 (Hierarchy)
- **Primary**: 메인 색상을 기준으로 하는 버튼입니다. 가장 중요한 액션에 사용됩니다
- **Secondary**: secondary 색상을 기준으로 하는 버튼입니다. 보조 액션에 사용됩니다
- **Destructive**: 파괴적인 액션(삭제, 제거 등)을 위한 버튼입니다

### 🎨 스타일 (Style)
- **Solid**: 배경이 채워진 스타일
- **Outline**: 테두리만 있는 스타일
- **Ghost**: 배경 없이 hover 시에만 배경이 나타나는 스타일
- **Plain**: 가장 단순한 스타일, 배경 없음

### 🔷 형태 (Shape)
- **Box**: 텍스트를 포함할 수 있는 박스 형태의 버튼
- **Icon**: 아이콘만 포함하는 버튼

### 📐 스타일 설정 방식
- **Primary**: \`PrimaryBoxButton\`은 \`_style\` prop으로 solid/outline 스타일을 설정 가능
- **Secondary**: 각 스타일별로 개별 컴포넌트로 존재 (Ghost, Outline, Plain)
- **Destructive**: Solid 스타일로 고정

## 🎯 Figma 연동

모든 버튼들은 피그마와 네이밍/variant가 동일하게 구현되어 있어, 피그마의 component 타입을 그대로 사용할 수 있습니다:

\`\`\`tsx
<PrimaryBoxButton _style="solid" size="md" />
\`\`\`

- **상태 변화**: state variant(default,hover,active)는 css 가상선택자로 구현이 되어있습니다. props로 주입하지 않아도 됩니다
- **비활성화**: disabled 상태는 직접 주입해야 합니다(HTML 속성으로 주입하면 스타일이 적용됩니다)
- **충돌 방지**: html attribute와 상충되는 속성은, \`_\` prefix를 붙였습니다
  
  예시: \`style\` -> \`_style\`

## ⚠️ 주의사항

**각 컴포넌트마다 모든 variant를 사용할 수 없습니다**

## 🔗 asChild 패턴

asChild prop을 통해 다른 엘리먼트를 버튼 스타일로 렌더링할 수 있습니다.
예시) Next.js Link 컴포넌트를 버튼 스타일로 렌더링할 수 있습니다:

\`\`\`tsx
<PrimaryBoxButton size="md" _style="solid" asChild>
  <Link href="/">
    <span>Link as Button</span>
  </Link>
</PrimaryBoxButton>
\`\`\`

## 📋 컴포넌트 목록

### Primary 버튼 (주요 액션)
- **PrimaryBoxButton**: 주요 액션을 위한 박스 형태의 버튼 (solid/outline 스타일 지원)
- **PrimarySolidIconButton**: 주요 액션을 위한 solid 스타일의 아이콘 버튼

### Secondary 버튼 (보조 액션)
- **SecondaryGhostIconButton**: 보조 액션을 위한 ghost 스타일의 아이콘 버튼 (배경 없음)
- **SecondaryOutlineBoxButton**: 보조 액션을 위한 outline 스타일의 박스 버튼
- **SecondaryPlainBoxButton**: 보조 액션을 위한 plain 스타일의 박스 버튼
- **SecondaryPlainIconButton**: 보조 액션을 위한 plain 스타일의 아이콘 버튼

### Destructive 버튼 (파괴적/삭제 액션)
- **DestructiveSolidBoxButton**: 삭제나 파괴적인 액션을 위한 solid 스타일의 박스 버튼
- **DestructiveSolidIconButton**: 삭제나 파괴적인 액션을 위한 solid 스타일의 아이콘 버튼

## 접근성 특징

- 키보드 네비게이션 완전 지원
- ARIA 속성 자동 설정
- 포커스 관리 및 시각적 피드백
- 스크린 리더 지원
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PrimaryBoxButton>

// eslint-disable-next-line storybook/csf-component
export default meta
type Story = StoryObj<typeof meta>

// 아이콘 매핑 객체
const iconMap = {
  Add,
  Arrow,
  Cross,
  Edit,
  Hidden,
  Iconplaceholder_24px,
  Magnifier,
  Minus,
  MoreDot,
  Play,
  Show,
  Sun,
  Trash,
  Unshare,
  Upload,
}

export const BoxButtons: Story = {
  parameters: {
    docs: {
      description: {
        story: `
박스 형태의 버튼들을 모두 볼 수 있습니다. 텍스트를 포함하며 다양한 크기와 스타일을 지원합니다.

**특징:**
- **Primary**: solid/outline 스타일 선택 가능
- **Secondary**: outline/plain 스타일별 개별 컴포넌트  
- **Destructive**: solid 스타일 고정
- 모든 박스 버튼은 \`asChild\` 패턴 지원
        `,
      },
    },
  },
  render: () => (
    <div className="space-y-8">
      {/* Primary Box Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Primary Box Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <PrimaryBoxButton _style="solid" size="md">
            Primary Solid
          </PrimaryBoxButton>
          <PrimaryBoxButton _style="outline" size="md">
            Primary Outline
          </PrimaryBoxButton>
          <PrimaryBoxButton _style="solid" size="lg">
            Large Size
          </PrimaryBoxButton>
          <PrimaryBoxButton _style="solid" size="md" disabled>
            Disabled
          </PrimaryBoxButton>
        </div>
      </div>

      {/* Secondary Box Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Secondary Box Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <SecondaryOutlineBoxButton size="md">
            Secondary Outline
          </SecondaryOutlineBoxButton>
          <SecondaryOutlineBoxButton size="lg">
            Large Size
          </SecondaryOutlineBoxButton>
          <SecondaryPlainBoxButton>Secondary Plain</SecondaryPlainBoxButton>
          <SecondaryOutlineBoxButton size="md" disabled>
            Disabled
          </SecondaryOutlineBoxButton>
        </div>
      </div>

      {/* Destructive Box Button */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Destructive Box Button</h3>
        <div className="flex flex-wrap gap-4">
          <DestructiveSolidBoxButton size="md">
            Delete Item
          </DestructiveSolidBoxButton>
          <DestructiveSolidBoxButton size="lg">
            Large Delete
          </DestructiveSolidBoxButton>
          <DestructiveSolidBoxButton size="md" disabled>
            Disabled
          </DestructiveSolidBoxButton>
        </div>
      </div>
    </div>
  ),
}

export const IconButtons: Story = {
  parameters: {
    docs: {
      description: {
        story: `
아이콘 형태의 버튼들을 모두 볼 수 있습니다. 아이콘만 포함하며 공간 효율적인 인터페이스에 적합합니다.

**특징:**
- **Primary Solid**: 주요 아이콘 액션
- **Secondary Plain**: 3가지 크기 지원 (sm, md, lg)
- **Secondary Ghost**: 44x44px 고정 크기, 14가지 아이콘 지원
- 모든 아이콘 버튼은 정사각형 형태
        `,
      },
    },
  },
  render: () => (
    <div className="space-y-8">
      {/* Primary Icon Button */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Primary Icon Button</h3>
        <div className="flex flex-wrap items-center gap-4">
          <PrimarySolidIconButton>
            <Add />
          </PrimarySolidIconButton>
          <PrimarySolidIconButton>
            <Edit />
          </PrimarySolidIconButton>
          <PrimarySolidIconButton>
            <Trash />
          </PrimarySolidIconButton>
          <PrimarySolidIconButton disabled>
            <Play />
          </PrimarySolidIconButton>
        </div>
      </div>

      {/* Secondary Plain Icon Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Secondary Plain Icon Buttons</h3>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-4">
            <span className="w-12 text-sm font-medium">Small:</span>
            <SecondaryPlainIconButton size="sm">
              <Edit />
            </SecondaryPlainIconButton>
            <SecondaryPlainIconButton size="sm">
              <Play />
            </SecondaryPlainIconButton>
            <SecondaryPlainIconButton size="sm">
              <Trash />
            </SecondaryPlainIconButton>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="w-12 text-sm font-medium">Medium:</span>
            <SecondaryPlainIconButton size="md">
              <Edit />
            </SecondaryPlainIconButton>
            <SecondaryPlainIconButton size="md">
              <Play />
            </SecondaryPlainIconButton>
            <SecondaryPlainIconButton size="md">
              <Trash />
            </SecondaryPlainIconButton>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="w-12 text-sm font-medium">Large:</span>
            <SecondaryPlainIconButton size="lg">
              <Edit />
            </SecondaryPlainIconButton>
            <SecondaryPlainIconButton size="lg">
              <Play />
            </SecondaryPlainIconButton>
            <SecondaryPlainIconButton size="lg">
              <Trash />
            </SecondaryPlainIconButton>
          </div>
        </div>
      </div>

      {/* Secondary Ghost Icon Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Secondary Ghost Icon Buttons (44x44px)
        </h3>
        <div className="grid grid-cols-7 gap-4">
          {Object.entries(iconMap).map(([name, IconComponent]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <SecondaryGhostIconButton>
                <IconComponent />
              </SecondaryGhostIconButton>
              <span className="text-xs text-gray-600">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

export const SizeComparison: Story = {
  parameters: {
    docs: {
      description: {
        story: `
각 버튼 타입별로 지원하는 크기를 비교해볼 수 있습니다.

**크기 지원 현황:**
- **PrimaryBoxButton**: xs, sm, md, lg, xl, 2xl (6가지)
- **DestructiveSolidBoxButton**: xs, sm, md, lg, xl, 2xl (6가지)
- **SecondaryOutlineBoxButton**: md, lg (2가지)
- **SecondaryPlainIconButton**: sm, md, lg (3가지)
- **기타**: 고정 크기
        `,
      },
    },
  },
  render: () => (
    <div className="space-y-8">
      {/* Primary Box Button Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Primary Box Button Sizes</h3>
        <div className="flex flex-wrap items-end gap-4">
          {["xs", "sm", "md", "lg", "xl", "2xl"].map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <PrimaryBoxButton
                _style="solid"
                size={size as "xs" | "sm" | "md" | "lg" | "xl" | "2xl"}
              >
                {size.toUpperCase()}
              </PrimaryBoxButton>
              <span className="text-xs text-gray-600">{size}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Destructive Box Button Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Destructive Box Button Sizes</h3>
        <div className="flex flex-wrap items-end gap-4">
          {["xs", "sm", "md", "lg", "xl", "2xl"].map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <DestructiveSolidBoxButton
                size={size as "xs" | "sm" | "md" | "lg" | "xl" | "2xl"}
              >
                Delete {size.toUpperCase()}
              </DestructiveSolidBoxButton>
              <span className="text-xs text-gray-600">{size}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Plain Icon Button Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Secondary Plain Icon Button Sizes
        </h3>
        <div className="flex flex-wrap items-end gap-4">
          {["sm", "md", "lg"].map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <SecondaryPlainIconButton size={size as "sm" | "md" | "lg"}>
                <Edit />
              </SecondaryPlainIconButton>
              <span className="text-xs text-gray-600">{size}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

export const InteractiveStates: Story = {
  parameters: {
    docs: {
      description: {
        story: `
버튼의 다양한 상태를 확인할 수 있습니다. 모든 상태는 CSS 가상선택자로 구현되어 자동으로 적용됩니다.

**상태:**
- **Default**: 기본 상태
- **Hover**: 마우스를 올렸을 때 (자동 적용)
- **Active**: 클릭했을 때 (자동 적용)
- **Focus**: 키보드 포커스 시 (자동 적용)
- **Disabled**: 비활성화 상태 (disabled 속성 사용)
        `,
      },
    },
  },
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Default vs Disabled States</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-medium">Default States</h4>
            <div className="space-y-2">
              <PrimaryBoxButton _style="solid" size="md">
                Primary Solid
              </PrimaryBoxButton>
              <SecondaryOutlineBoxButton size="md">
                Secondary Outline
              </SecondaryOutlineBoxButton>
              <DestructiveSolidBoxButton size="md">
                Destructive
              </DestructiveSolidBoxButton>
              <div className="flex gap-2">
                <PrimarySolidIconButton>
                  <Add />
                </PrimarySolidIconButton>
                <SecondaryPlainIconButton size="md">
                  <Edit />
                </SecondaryPlainIconButton>
                <SecondaryGhostIconButton>
                  <Trash />
                </SecondaryGhostIconButton>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Disabled States</h4>
            <div className="space-y-2">
              <PrimaryBoxButton _style="solid" size="md" disabled>
                Primary Solid
              </PrimaryBoxButton>
              <SecondaryOutlineBoxButton size="md" disabled>
                Secondary Outline
              </SecondaryOutlineBoxButton>
              <DestructiveSolidBoxButton size="md" disabled>
                Destructive
              </DestructiveSolidBoxButton>
              <div className="flex gap-2">
                <PrimarySolidIconButton disabled>
                  <Add />
                </PrimarySolidIconButton>
                <SecondaryPlainIconButton size="md" disabled>
                  <Edit />
                </SecondaryPlainIconButton>
                <SecondaryGhostIconButton disabled>
                  <Trash />
                </SecondaryGhostIconButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const AsChildPattern: Story = {
  parameters: {
    docs: {
      description: {
        story: `
\`asChild\` 패턴을 사용하여 다른 요소를 버튼 스타일로 렌더링하는 예시입니다.
Next.js Link, React Router Link 등과 함께 사용할 때 매우 유용합니다.

**사용법:**
\`\`\`tsx
<PrimaryBoxButton asChild>
  <a href="/link">External Link</a>
</PrimaryBoxButton>
\`\`\`
        `,
      },
    },
  },
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">asChild Examples</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">버튼을 링크로 사용:</p>
            <div className="flex gap-4">
              <PrimaryBoxButton _style="solid" size="md" asChild>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Link as Button
                </a>
              </PrimaryBoxButton>
              <SecondaryOutlineBoxButton size="md" asChild>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Outline Link
                </a>
              </SecondaryOutlineBoxButton>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">아이콘 버튼을 링크로 사용:</p>
            <div className="flex gap-4">
              <PrimarySolidIconButton asChild>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <Edit />
                </a>
              </PrimarySolidIconButton>
              <SecondaryPlainBoxButton asChild>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Plain Link
                </a>
              </SecondaryPlainBoxButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}
