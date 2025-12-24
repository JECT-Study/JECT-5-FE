/* eslint-disable @typescript-eslint/no-empty-object-type */
/**
 * https://developers.figma.com/docs/plugins/api/node-properties/
 */

export type NodeDimensions = Rect

export interface NodeLayoutSizing {
  layoutAlign?: LayoutMixin["layoutAlign"]
  layoutGrow?: LayoutMixin["layoutGrow"]
  layoutSizingHorizontal?: LayoutMixin["layoutSizingHorizontal"]
  layoutSizingVertical?: LayoutMixin["layoutSizingVertical"]
}

/**
 * padding
 */
export interface NodeAutoLayoutPadding {
  left?: AutoLayoutMixin["paddingLeft"]
  right?: AutoLayoutMixin["paddingRight"]
  top?: AutoLayoutMixin["paddingTop"]
  bottom?: AutoLayoutMixin["paddingBottom"]
}

export interface NodeAutoLayoutStyle {
  layoutMode?: AutoLayoutMixin["layoutMode"]
  primaryAxisAlignItems?: AutoLayoutMixin["primaryAxisAlignItems"]
  counterAxisAlignItems?: AutoLayoutMixin["counterAxisAlignItems"]
  primaryAxisSizingMode?: AutoLayoutMixin["primaryAxisSizingMode"]
  counterAxisSizingMode?: AutoLayoutMixin["counterAxisSizingMode"]
  itemSpacing?: AutoLayoutMixin["itemSpacing"]
  padding?: NodeAutoLayoutPadding
}

export interface NodeCornerRadii {
  topLeft?: RectangleCornerMixin["topLeftRadius"]
  topRight?: RectangleCornerMixin["topRightRadius"]
  bottomLeft?: RectangleCornerMixin["bottomLeftRadius"]
  bottomRight?: RectangleCornerMixin["bottomRightRadius"]
}

export interface TextTypographyMixedFlags {
  textAlignHorizontal?: true
  textAlignVertical?: true
  paragraphIndent?: true
  paragraphSpacing?: true
  lineHeight?: true
  letterSpacing?: true
  textCase?: true
  textDecoration?: true
}

export interface NodeStyle {
  dimensions: NodeDimensions
  layout?: NodeLayoutSizing
  autoLayout?: NodeAutoLayoutStyle
  fills?: GeometryMixin["fills"]
  fillStyleId?: GeometryMixin["fillStyleId"]
  hasMixedFills?: boolean
  hasMixedFillStyleId?: boolean
  strokes?: GeometryMixin["strokes"]
  strokeStyleId?: GeometryMixin["strokeStyleId"]
  hasMixedStrokes?: boolean
  cornerRadius?: CornerMixin["cornerRadius"]
  hasMixedCornerRadius?: boolean
  cornerRadii?: NodeCornerRadii
}

export interface TextTypographyDefaults {
  textAlignHorizontal?: TextNode["textAlignHorizontal"]
  textAlignVertical?: TextNode["textAlignVertical"]
  paragraphIndent?: TextNode["paragraphIndent"]
  paragraphSpacing?: TextNode["paragraphSpacing"]
  lineHeight?: TextNode["lineHeight"]
  letterSpacing?: TextNode["letterSpacing"]
  textCase?: TextNode["textCase"]
  textDecoration?: TextNode["textDecoration"]
  mixed?: TextTypographyMixedFlags
}

export interface TextNodeStyle extends NodeStyle {
  typography?: TextTypographyDefaults
}

export type TextStyledSegment = ReturnType<
  TextNode["getStyledTextSegments"]
>[number]

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

export interface BaseNodeProps<TStyle = NodeStyle | undefined> {
  id: SceneNode["id"]
  name: string
  style?: TStyle
  css?: string
  boundVariables?: BoundVariableReference[]
}

export interface InstanceNodeProps extends BaseNodeProps<NodeStyle> {
  style: NodeStyle
  componentProperties: InstanceComponentPropertyMap
  componentValues: InstanceComponentValueMap
}

export interface FrameNodeProps extends BaseNodeProps<NodeStyle> {
  style: NodeStyle
}

export interface TextNodeProps extends BaseNodeProps<TextNodeStyle> {
  style: TextNodeStyle
  characters: string
  segments: readonly TextStyledSegment[]
}

export interface RectangleNodeProps extends BaseNodeProps<NodeStyle> {
  style: NodeStyle
}

export interface GroupNodeProps extends BaseNodeProps<undefined> {}

export interface GenericNodeProps extends BaseNodeProps<undefined> {
  rawType: SceneNode["type"]
}

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
