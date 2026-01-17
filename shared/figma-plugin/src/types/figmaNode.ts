/* eslint-disable @typescript-eslint/no-empty-object-type */
/**
 * https://developers.figma.com/docs/plugins/api/node-properties/
 */

// =============================================================================
// Node layout & styling primitives
// =============================================================================
export type FigmaNodeDimensions = Rect

export interface FigmaLayoutSizing {
  layoutAlign?: LayoutMixin["layoutAlign"]
  layoutGrow?: LayoutMixin["layoutGrow"]
  layoutSizingHorizontal?: LayoutMixin["layoutSizingHorizontal"]
  layoutSizingVertical?: LayoutMixin["layoutSizingVertical"]
}

/**
 * padding
 */
export interface FigmaAutoLayoutPadding {
  left?: AutoLayoutMixin["paddingLeft"]
  right?: AutoLayoutMixin["paddingRight"]
  top?: AutoLayoutMixin["paddingTop"]
  bottom?: AutoLayoutMixin["paddingBottom"]
}

export interface FigmaAutoLayoutStyle {
  layoutMode?: AutoLayoutMixin["layoutMode"]
  primaryAxisAlignItems?: AutoLayoutMixin["primaryAxisAlignItems"]
  counterAxisAlignItems?: AutoLayoutMixin["counterAxisAlignItems"]
  primaryAxisSizingMode?: AutoLayoutMixin["primaryAxisSizingMode"]
  counterAxisSizingMode?: AutoLayoutMixin["counterAxisSizingMode"]
  itemSpacing?: AutoLayoutMixin["itemSpacing"]
  padding?: FigmaAutoLayoutPadding
}

export interface FigmaCornerRadii {
  topLeft?: RectangleCornerMixin["topLeftRadius"]
  topRight?: RectangleCornerMixin["topRightRadius"]
  bottomLeft?: RectangleCornerMixin["bottomLeftRadius"]
  bottomRight?: RectangleCornerMixin["bottomRightRadius"]
}

export interface FigmaTextTypographyMixedFlags {
  textAlignHorizontal?: true
  textAlignVertical?: true
  paragraphIndent?: true
  paragraphSpacing?: true
  lineHeight?: true
  letterSpacing?: true
  textCase?: true
  textDecoration?: true
}

export interface ExtractedNodeStyle {
  dimensions: FigmaNodeDimensions
  layout?: FigmaLayoutSizing
  autoLayout?: FigmaAutoLayoutStyle
  fills?: GeometryMixin["fills"]
  fillStyleId?: GeometryMixin["fillStyleId"]
  hasMixedFills?: boolean
  hasMixedFillStyleId?: boolean
  strokes?: GeometryMixin["strokes"]
  strokeStyleId?: GeometryMixin["strokeStyleId"]
  hasMixedStrokes?: boolean
  cornerRadius?: CornerMixin["cornerRadius"]
  hasMixedCornerRadius?: boolean
  cornerRadii?: FigmaCornerRadii
}

// =============================================================================
// Text styling helpers
// =============================================================================
export interface FigmaTextTypographyDefaults {
  textAlignHorizontal?: TextNode["textAlignHorizontal"]
  textAlignVertical?: TextNode["textAlignVertical"]
  paragraphIndent?: TextNode["paragraphIndent"]
  paragraphSpacing?: TextNode["paragraphSpacing"]
  lineHeight?: TextNode["lineHeight"]
  letterSpacing?: TextNode["letterSpacing"]
  textCase?: TextNode["textCase"]
  textDecoration?: TextNode["textDecoration"]
  mixed?: FigmaTextTypographyMixedFlags
}

export interface ExtractedTextNodeStyle extends ExtractedNodeStyle {
  typography?: FigmaTextTypographyDefaults
}

export type TextStyledSegment = ReturnType<
  TextNode["getStyledTextSegments"]
>[number]

// =============================================================================
// Component instance overrides
// =============================================================================
export type InstanceComponentPropertyDefinition =
  InstanceNode["componentProperties"][string]

export type InstanceComponentPropertyMap = Record<
  string,
  InstanceComponentPropertyDefinition
>

export type InstanceComponentValueMap = Record<
  string,
  InstanceComponentPropertyDefinition["value"]
>

// =============================================================================
// Variable binding references
// =============================================================================
export interface BoundVariableReference {
  property: string
  aliasIds: string[]
}

export interface VariableBindingOccurrence {
  nodeId: SceneNode["id"]
  nodeName: string
  property: string
}

export type VariableBindingIndex = Map<string, VariableBindingOccurrence[]>

// =============================================================================
// Node prop contracts (node props → React props)
// =============================================================================
export interface BaseNodeProps<TStyle = ExtractedNodeStyle | undefined> {
  id: SceneNode["id"]
  name: string
  style?: TStyle
  css?: string
  boundVariables?: BoundVariableReference[]
}

export interface InstanceNodeProps extends BaseNodeProps<ExtractedNodeStyle> {
  style: ExtractedNodeStyle
  componentProperties: InstanceComponentPropertyMap
  componentValues: InstanceComponentValueMap
}

export interface FrameNodeProps extends BaseNodeProps<ExtractedNodeStyle> {
  style: ExtractedNodeStyle
}

export interface TextNodeProps extends BaseNodeProps<ExtractedTextNodeStyle> {
  style: ExtractedTextNodeStyle
  characters: string
  segments: readonly TextStyledSegment[]
}

export interface RectangleNodeProps extends BaseNodeProps<ExtractedNodeStyle> {
  style: ExtractedNodeStyle
}

export interface GroupNodeProps extends BaseNodeProps<undefined> {}

export interface GenericNodeProps extends BaseNodeProps<undefined> {
  rawType: SceneNode["type"]
}

// =============================================================================
// React-friendly node tree definitions
// =============================================================================
export interface BaseReactNode<
  TType extends string,
  TProps extends BaseNodeProps,
  TChildren = ReactFigmaNode[],
> {
  type: TType
  props: TProps
  children?: TChildren
}

export type InstanceReactNode = BaseReactNode<"Instance", InstanceNodeProps>

export type FrameReactNode = BaseReactNode<"Frame", FrameNodeProps>

export type TextReactNode = BaseReactNode<"Text", TextNodeProps, []>

export type RectangleReactNode = BaseReactNode<
  "Rectangle",
  RectangleNodeProps,
  []
>

export type GroupReactNode = BaseReactNode<"Group", GroupNodeProps>

export type GenericReactNode = BaseReactNode<string, GenericNodeProps>

export type ReactFigmaNode =
  | InstanceReactNode
  | FrameReactNode
  | TextReactNode
  | RectangleReactNode
  | GroupReactNode
  | GenericReactNode

// =============================================================================
// Variable usage + selection payload helpers
// =============================================================================
export interface VariableUsageSummary {
  id: string
  name: string
  usedIn: string[]
}

export type VariableUsageMap = Map<string, VariableUsageSummary>

export interface SelectionNodeSummary {
  id: SceneNode["id"]
  name: string
  type: SceneNode["type"]
  visible: boolean
}

export interface SelectionDataPayload {
  selectionCount: number
  selection: SelectionNodeSummary[]
  reactNodes: ReactFigmaNode[]
  variables: Record<string, VariableUsageSummary>
}
