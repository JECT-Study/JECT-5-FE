import { isUndefined } from "es-toolkit"

import type {
  ExtractedTextNodeStyle,
  FigmaTextTypographyDefaults,
  FigmaTextTypographyMixedFlags,
  TextStyledSegment,
} from "../types/figmaNode"
import { extractNodeStyle } from "./style"

type TextSegmentProperty = Parameters<
  TextNode["getStyledTextSegments"]
>[0][number]

/**
 * 텍스트 구간별로 추출할 속성 목록입니다.
 */
const TEXT_SEGMENT_PROPERTIES: ReadonlyArray<TextSegmentProperty> = [
  "fontName",
  "fontSize",
  "textStyleId",
  "fillStyleId",
  "fills",
  "letterSpacing",
  "lineHeight",
  "textDecoration",
  "textCase",
]

const isFigmaMixed = (value: unknown): boolean =>
  typeof figma !== "undefined" && value === figma.mixed

/**
 * typography 구조에 실제 값이 존재하는지 판단합니다.
 */
const hasTypographyValue = (defaults: FigmaTextTypographyDefaults): boolean =>
  Object.values(defaults).some((value) => value !== undefined)

/**
 * TextNode의 기본 Typography 값을 모아 FigmaTextTypographyDefaults 형태로 생성합니다.
 */
const buildTypographyDefaults = (
  node: TextNode,
): FigmaTextTypographyDefaults | undefined => {
  const defaults: FigmaTextTypographyDefaults = {}
  const mixed: FigmaTextTypographyMixedFlags = {}

  const registerTypography = <
    K extends keyof FigmaTextTypographyMixedFlags &
      keyof FigmaTextTypographyDefaults,
  >(
    key: K,
    value: FigmaTextTypographyDefaults[K],
  ) => {
    if (isFigmaMixed(value)) {
      mixed[key] = true
      return
    }

    if (!isUndefined(value)) {
      defaults[key] = value
    }
  }

  registerTypography("textAlignHorizontal", node.textAlignHorizontal)
  registerTypography("textAlignVertical", node.textAlignVertical)
  registerTypography("paragraphIndent", node.paragraphIndent)
  registerTypography("paragraphSpacing", node.paragraphSpacing)
  registerTypography("lineHeight", node.lineHeight)
  registerTypography("letterSpacing", node.letterSpacing)
  registerTypography("textCase", node.textCase)
  registerTypography("textDecoration", node.textDecoration)

  const hasMixed = Object.keys(mixed).length > 0
  if (hasMixed) {
    defaults.mixed = mixed
  }

  const hasValue = hasTypographyValue(defaults)
  return hasValue || hasMixed ? defaults : undefined
}

/**
 * TextNode 전용 스타일 정보를 ExtractedNodeStyle 기반으로 확장해 typography 기본값을 포함시킵니다.
 */
export const extractTextNodeStyle = (
  node: TextNode,
): ExtractedTextNodeStyle => {
  const baseStyle = extractNodeStyle(node)
  const typography = buildTypographyDefaults(node)

  const textStyle: ExtractedTextNodeStyle = {
    ...baseStyle,
  }

  if (typography) {
    textStyle.typography = typography
  }

  return textStyle
}

/**
 * TextNode에서 getStyledTextSegments API를 사용해 텍스트 구간별 스타일 정보를 추출합니다.
 */
export const extractTextSegments = (
  node: TextNode,
  properties: TextSegmentProperty[] = [...TEXT_SEGMENT_PROPERTIES],
): readonly TextStyledSegment[] => {
  if (typeof node.getStyledTextSegments !== "function") {
    console.warn(
      "TextNode#getStyledTextSegments is unavailable; returning empty segments.",
    )
    return []
  }

  return node.getStyledTextSegments(properties)
}
