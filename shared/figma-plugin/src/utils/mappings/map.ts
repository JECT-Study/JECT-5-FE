// Figma to CSS 매핑 상수들

// =============================================================================
// AUTO LAYOUT 매핑
// =============================================================================

/** Figma layoutMode → CSS flex-direction */
export const LAYOUT_MODE_TO_FLEX_DIRECTION = {
  HORIZONTAL: "row",
  VERTICAL: "column",
  NONE: undefined, // auto layout이 아닌 경우
} as const

/** Figma primaryAxisAlignItems → CSS justify-content */
export const PRIMARY_AXIS_ALIGN_TO_JUSTIFY_CONTENT = {
  MIN: "flex-start",
  MAX: "flex-end",
  CENTER: "center",
  SPACE_BETWEEN: "space-between",
} as const

/** Figma counterAxisAlignItems → CSS align-items */
export const COUNTER_AXIS_ALIGN_TO_ALIGN_ITEMS = {
  MIN: "flex-start",
  MAX: "flex-end",
  CENTER: "center",
  BASELINE: "baseline", // 베이스라인 정렬도 지원
} as const

/** Figma primaryAxisSizingMode → CSS flex 관련 */
export const PRIMARY_AXIS_SIZING_MODE = {
  FIXED: "none", // flex: none
  AUTO: "1", // flex: 1 (grow)
} as const

/** Figma counterAxisSizingMode → CSS width/height 동작 */
export const COUNTER_AXIS_SIZING_MODE = {
  FIXED: "fixed", // 고정 크기
  AUTO: "auto", // 컨텐츠에 맞춤
} as const

// =============================================================================
// 텍스트 정렬 매핑
// =============================================================================

/** Figma textAlignHorizontal → CSS text-align */
export const TEXT_ALIGN_HORIZONTAL_TO_CSS = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
  JUSTIFIED: "justify",
} as const

/** Figma textAlignVertical → CSS vertical-align */
export const TEXT_ALIGN_VERTICAL_TO_CSS = {
  TOP: "top",
  CENTER: "middle",
  BOTTOM: "bottom",
} as const

/** Figma textAutoResize → CSS 관련 동작 */
export const TEXT_AUTO_RESIZE_TO_CSS = {
  NONE: { width: "fixed", height: "fixed" },
  WIDTH_AND_HEIGHT: { width: "auto", height: "auto" },
  HEIGHT: { width: "fixed", height: "auto" },
  TRUNCATE: { overflow: "hidden", "text-overflow": "ellipsis" },
} as const

// =============================================================================
// 텍스트 스타일 매핑
// =============================================================================

/** Figma textDecoration → CSS text-decoration */
export const TEXT_DECORATION_TO_CSS = {
  UNDERLINE: "underline",
  STRIKETHROUGH: "line-through",
  NONE: "none",
} as const

/** Figma textCase → CSS text-transform */
export const TEXT_CASE_TO_CSS = {
  ORIGINAL: "none",
  UPPER: "uppercase",
  LOWER: "lowercase",
  TITLE: "capitalize",
  SMALL_CAPS: "small-caps",
} as const

/** Figma fontWeight → CSS font-weight */
export const FONT_WEIGHT_TO_CSS = {
  100: "100", // Thin
  200: "200", // Extra Light
  300: "300", // Light
  400: "400", // Regular
  500: "500", // Medium
  600: "600", // Semi Bold
  700: "700", // Bold
  800: "800", // Extra Bold
  900: "900", // Black
} as const

// =============================================================================
// 레이아웃 관련 매핑
// =============================================================================

/** Figma layoutAlign → CSS align-self */
export const LAYOUT_ALIGN_TO_ALIGN_SELF = {
  INHERIT: "auto",
  STRETCH: "stretch",
  MIN: "flex-start",
  CENTER: "center",
  MAX: "flex-end",
} as const

/** Figma 제약조건 → CSS position 관련 */
export const CONSTRAINT_TO_CSS = {
  // Horizontal constraints
  LEFT: "left",
  RIGHT: "right",
  LEFT_RIGHT: "left-right",
  CENTER: "center",
  SCALE: "scale",

  // Vertical constraints
  TOP: "top",
  BOTTOM: "bottom",
  TOP_BOTTOM: "top-bottom",
} as const

// =============================================================================
// 효과 및 블렌드 매핑
// =============================================================================

/** Figma blendMode → CSS mix-blend-mode */
export const BLEND_MODE_TO_CSS = {
  PASS_THROUGH: "normal",
  NORMAL: "normal",
  DARKEN: "darken",
  MULTIPLY: "multiply",
  LINEAR_BURN: "color-burn",
  COLOR_BURN: "color-burn",
  LIGHTEN: "lighten",
  SCREEN: "screen",
  LINEAR_DODGE: "color-dodge",
  COLOR_DODGE: "color-dodge",
  OVERLAY: "overlay",
  SOFT_LIGHT: "soft-light",
  HARD_LIGHT: "hard-light",
  DIFFERENCE: "difference",
  EXCLUSION: "exclusion",
  HUE: "hue",
  SATURATION: "saturation",
  COLOR: "color",
  LUMINOSITY: "luminosity",
} as const

/** Figma strokeAlign → CSS border 처리 방식 */
export const STROKE_ALIGN_TO_CSS = {
  INSIDE: "inside", // box-sizing: border-box
  OUTSIDE: "outside", // outline 사용
  CENTER: "center", // 기본 border 동작
} as const

/** Figma strokeCap → CSS stroke-linecap */
export const STROKE_CAP_TO_CSS = {
  NONE: "butt",
  ROUND: "round",
  SQUARE: "square",
} as const

/** Figma strokeJoin → CSS stroke-linejoin */
export const STROKE_JOIN_TO_CSS = {
  MITER: "miter",
  BEVEL: "bevel",
  ROUND: "round",
} as const

// =============================================================================
// 단위 변환 매핑
// =============================================================================

/** Figma lineHeight unit → CSS 단위 */
export const LINE_HEIGHT_UNIT_TO_CSS = {
  PIXELS: "px",
  PERCENT: "%",
  INTRINSIC_PERCENT: "%",
  AUTO: "auto",
} as const

/** Figma letterSpacing unit → CSS 단위 */
export const LETTER_SPACING_UNIT_TO_CSS = {
  PIXELS: "px",
  PERCENT: "%",
} as const

// =============================================================================
// 타입 정의
// =============================================================================

export type FigmaLayoutMode = keyof typeof LAYOUT_MODE_TO_FLEX_DIRECTION
export type FigmaPrimaryAxisAlign =
  keyof typeof PRIMARY_AXIS_ALIGN_TO_JUSTIFY_CONTENT
export type FigmaCounterAxisAlign =
  keyof typeof COUNTER_AXIS_ALIGN_TO_ALIGN_ITEMS
export type FigmaTextAlignHorizontal = keyof typeof TEXT_ALIGN_HORIZONTAL_TO_CSS
export type FigmaTextAlignVertical = keyof typeof TEXT_ALIGN_VERTICAL_TO_CSS
export type FigmaTextDecoration = keyof typeof TEXT_DECORATION_TO_CSS
export type FigmaTextCase = keyof typeof TEXT_CASE_TO_CSS
export type FigmaBlendMode = keyof typeof BLEND_MODE_TO_CSS
export type FigmaStrokeAlign = keyof typeof STROKE_ALIGN_TO_CSS

// =============================================================================
// 유틸리티 함수들
// =============================================================================

/** 안전한 매핑 함수 - 매핑되지 않은 값에 대해 기본값 반환 */
export function safeMapValue<T extends Record<string, any>, K extends keyof T>(
  mapping: T,
  value: K | string,
  fallback: T[K],
): T[K] {
  return mapping[value as K] ?? fallback
}

/** Figma 색상을 CSS 색상으로 변환 */
export function figmaColorToCSS(
  color: { r: number; g: number; b: number },
  opacity?: number,
): string {
  const r = Math.round(color.r * 255)
  const g = Math.round(color.g * 255)
  const b = Math.round(color.b * 255)

  if (opacity !== undefined && opacity < 1) {
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  return `rgb(${r}, ${g}, ${b})`
}

/** Figma 값을 CSS 픽셀 단위로 변환 */
export function figmaValueToPixels(value: number): string {
  return `${Math.round(value)}px`
}
