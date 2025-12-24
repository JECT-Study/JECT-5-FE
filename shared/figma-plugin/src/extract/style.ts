import { isUndefined } from "es-toolkit"

import type {
  NodeAutoLayoutPadding,
  NodeAutoLayoutStyle,
  NodeCornerRadii,
  NodeDimensions,
  NodeLayoutSizing,
  NodeStyle,
} from "../types/figmaNode"

/**
 * SceneNode의 위치·크기 기본 치수를 NodeDimensions 형태로 추출합니다.
 */
const DIMENSION_KEYS: ReadonlyArray<keyof NodeDimensions> = [
  "x",
  "y",
  "width",
  "height",
]

/**
 * LayoutMixin이 제공하는 배치 관련 속성을 NodeLayoutSizing으로 수집합니다.
 */
const LAYOUT_SIZING_KEYS: ReadonlyArray<keyof NodeLayoutSizing> = [
  "layoutAlign",
  "layoutGrow",
  "layoutSizingHorizontal",
  "layoutSizingVertical",
]

/**
 * AutoLayoutMixin에서 필요한 핵심 속성 목록입니다.
 */
const AUTO_LAYOUT_KEYS: ReadonlyArray<keyof AutoLayoutMixin> = [
  "layoutMode",
  "primaryAxisAlignItems",
  "counterAxisAlignItems",
  "primaryAxisSizingMode",
  "counterAxisSizingMode",
  "itemSpacing",
]

type AutoLayoutNode = SceneNode & AutoLayoutMixin

type LayoutNode = SceneNode & LayoutMixin

type GeometryNode = SceneNode & GeometryMixin

type CornerNode = SceneNode & CornerMixin

const hasLayoutMixin = (node: SceneNode): node is LayoutNode =>
  "layoutGrow" in node

const hasAutoLayoutMixin = (node: SceneNode): node is AutoLayoutNode =>
  "layoutMode" in node

const hasGeometryMixin = (node: SceneNode): node is GeometryNode =>
  "fills" in node

const hasCornerMixin = (node: SceneNode): node is CornerNode =>
  "cornerRadius" in node

const hasRectangleCornerMixin = (
  node: SceneNode,
): node is SceneNode & RectangleCornerMixin =>
  "topLeftRadius" in node &&
  "topRightRadius" in node &&
  "bottomLeftRadius" in node &&
  "bottomRightRadius" in node

const hasOwn = <T extends object>(
  target: T,
  key: PropertyKey,
): key is keyof T => Object.prototype.hasOwnProperty.call(target, key)

const pick = <T extends object, K extends keyof T>(
  target: T,
  keys: ReadonlyArray<K>,
): Pick<T, K> => {
  const result = {} as Pick<T, K>

  keys.forEach((key) => {
    if (hasOwn(target, key)) {
      result[key] = target[key]
    }
  })

  return result
}

const isFigmaMixed = (value: unknown): boolean =>
  typeof figma !== "undefined" && value === figma.mixed

const collectCornerRadii = (node: SceneNode): NodeCornerRadii | undefined => {
  if (!hasRectangleCornerMixin(node)) {
    return undefined
  }

  const radii: NodeCornerRadii = {}

  if (!isUndefined(node.topLeftRadius)) {
    radii.topLeft = node.topLeftRadius
  }

  if (!isUndefined(node.topRightRadius)) {
    radii.topRight = node.topRightRadius
  }

  if (!isUndefined(node.bottomLeftRadius)) {
    radii.bottomLeft = node.bottomLeftRadius
  }

  if (!isUndefined(node.bottomRightRadius)) {
    radii.bottomRight = node.bottomRightRadius
  }

  return Object.keys(radii).length > 0 ? radii : undefined
}

export const extractDimensions = (node: SceneNode): NodeDimensions =>
  pick(node, DIMENSION_KEYS)

/**
 * LayoutMixin을 구현한 노드에서 layoutAlign/layoutGrow 등 배치 속성을 추출합니다.
 */
export const extractLayoutSizing = (
  node: SceneNode,
): NodeLayoutSizing | undefined => {
  if (!hasLayoutMixin(node)) {
    return undefined
  }

  const sizing = pick(node, LAYOUT_SIZING_KEYS)
  const hasValue = LAYOUT_SIZING_KEYS.some((key) => !isUndefined(sizing[key]))
  if (!hasValue) {
    return undefined
  }

  return sizing
}

/**
 * AutoLayoutMixin 노드의 padding 값을 NodeAutoLayoutPadding 구조로 변환합니다.
 */
const extractAutoLayoutPadding = (
  node: AutoLayoutNode,
): NodeAutoLayoutPadding | undefined => {
  const padding: NodeAutoLayoutPadding = {}

  if (!isUndefined(node.paddingLeft)) {
    padding.left = node.paddingLeft
  }

  if (!isUndefined(node.paddingRight)) {
    padding.right = node.paddingRight
  }

  if (!isUndefined(node.paddingTop)) {
    padding.top = node.paddingTop
  }

  if (!isUndefined(node.paddingBottom)) {
    padding.bottom = node.paddingBottom
  }

  const hasPadding = Object.keys(padding).length > 0
  return hasPadding ? padding : undefined
}

/**
 * AutoLayoutMixin 노드에서 축 정렬, sizingMode, itemSpacing 등 자동 레이아웃 정보를 추출합니다.
 */
export const extractAutoLayout = (
  node: SceneNode,
): NodeAutoLayoutStyle | undefined => {
  if (!hasAutoLayoutMixin(node)) {
    return undefined
  }

  const picked = pick(node, AUTO_LAYOUT_KEYS)
  const style: NodeAutoLayoutStyle = {}

  if (!isUndefined(picked.layoutMode)) {
    style.layoutMode = picked.layoutMode
  }

  if (!isUndefined(picked.primaryAxisAlignItems)) {
    style.primaryAxisAlignItems = picked.primaryAxisAlignItems
  }

  if (!isUndefined(picked.counterAxisAlignItems)) {
    style.counterAxisAlignItems = picked.counterAxisAlignItems
  }

  if (!isUndefined(picked.primaryAxisSizingMode)) {
    style.primaryAxisSizingMode = picked.primaryAxisSizingMode
  }

  if (!isUndefined(picked.counterAxisSizingMode)) {
    style.counterAxisSizingMode = picked.counterAxisSizingMode
  }

  if (!isUndefined(picked.itemSpacing)) {
    style.itemSpacing = picked.itemSpacing
  }

  const padding = extractAutoLayoutPadding(node)
  if (padding) {
    style.padding = padding
  }

  const hasValue =
    Object.keys(style).length > 0 ||
    (style.padding && Object.keys(style.padding).length > 0)

  return hasValue ? style : undefined
}

/**
 * GeometryMixin 노드에서 fills 및 fillStyleId를 안전하게 추출합니다.
 */
const extractFill = (
  node: SceneNode,
): {
  fills?: NodeStyle["fills"]
  fillStyleId?: NodeStyle["fillStyleId"]
  hasMixedFills?: boolean
  hasMixedFillStyleId?: boolean
} => {
  if (!hasGeometryMixin(node)) {
    return {}
  }

  const fills = node.fills
  const result: {
    fills?: NodeStyle["fills"]
    fillStyleId?: NodeStyle["fillStyleId"]
    hasMixedFills?: boolean
    hasMixedFillStyleId?: boolean
  } = {}

  if (!isUndefined(fills)) {
    if (isFigmaMixed(fills)) {
      result.hasMixedFills = true
    } else {
      result.fills = fills
    }
  }

  if ("fillStyleId" in node) {
    const fillStyleId = node.fillStyleId
    if (isFigmaMixed(fillStyleId)) {
      result.hasMixedFillStyleId = true
    } else if (typeof fillStyleId === "string") {
      result.fillStyleId = fillStyleId
    }
  }

  return result
}

/**
 * GeometryMixin/CornerMixin 노드에서 stroke 정보와 cornerRadius를 수집합니다.
 */
const extractStroke = (
  node: SceneNode,
): {
  strokes?: NodeStyle["strokes"]
  strokeStyleId?: NodeStyle["strokeStyleId"]
  cornerRadius?: NodeStyle["cornerRadius"]
  hasMixedStrokes?: boolean
  hasMixedCornerRadius?: boolean
  cornerRadii?: NodeCornerRadii
} => {
  const result: {
    strokes?: NodeStyle["strokes"]
    strokeStyleId?: NodeStyle["strokeStyleId"]
    cornerRadius?: NodeStyle["cornerRadius"]
    hasMixedStrokes?: boolean
    hasMixedCornerRadius?: boolean
    cornerRadii?: NodeCornerRadii
  } = {}

  if (hasGeometryMixin(node)) {
    const strokes = node.strokes
    if (!isUndefined(strokes)) {
      if (isFigmaMixed(strokes)) {
        result.hasMixedStrokes = true
      } else {
        result.strokes = strokes
      }
    }

    if ("strokeStyleId" in node && typeof node.strokeStyleId === "string") {
      result.strokeStyleId = node.strokeStyleId
    }
  }

  if (hasCornerMixin(node)) {
    const radius = node.cornerRadius
    if (typeof radius === "number") {
      result.cornerRadius = radius
    } else if (isFigmaMixed(radius)) {
      result.hasMixedCornerRadius = true
      const radii = collectCornerRadii(node)
      if (radii) {
        result.cornerRadii = radii
      }
    }
  }

  return result
}

/**
 * SceneNode 전반에서 공통적으로 사용 가능한 스타일 정보를 NodeStyle 형태로 구성합니다.
 */
export const extractNodeStyle = (node: SceneNode): NodeStyle => {
  const style: NodeStyle = {
    dimensions: extractDimensions(node),
  }

  const layout = extractLayoutSizing(node)
  if (layout) {
    style.layout = layout
  }

  const autoLayout = extractAutoLayout(node)
  if (autoLayout) {
    style.autoLayout = autoLayout
  }

  const fill = extractFill(node)
  if (fill.fills) {
    style.fills = fill.fills
  }
  if (fill.fillStyleId) {
    style.fillStyleId = fill.fillStyleId
  }
  if (fill.hasMixedFills) {
    style.hasMixedFills = true
  }
  if (fill.hasMixedFillStyleId) {
    style.hasMixedFillStyleId = true
  }

  const stroke = extractStroke(node)
  if (stroke.strokes) {
    style.strokes = stroke.strokes
  }
  if (stroke.strokeStyleId) {
    style.strokeStyleId = stroke.strokeStyleId
  }
  if (!isUndefined(stroke.cornerRadius)) {
    style.cornerRadius = stroke.cornerRadius
  }
  if (stroke.hasMixedStrokes) {
    style.hasMixedStrokes = true
  }
  if (stroke.hasMixedCornerRadius) {
    style.hasMixedCornerRadius = true
  }
  if (stroke.cornerRadii) {
    style.cornerRadii = stroke.cornerRadii
  }

  return style
}
