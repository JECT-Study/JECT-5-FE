const extractProps = (props: ComponentProperties) => {
  return Object.entries(
    Object.entries(props).map(([key, obj]) => [key, obj.value]),
  )
}

const extractVariable = async (
  variableAlias: SceneNodeMixin["boundVariables"],
): Promise<Record<string, string[]>> => {
  const result: Record<string, string[]> = {}

  if (!variableAlias) {
    return result
  }

  for (const key of Object.keys(variableAlias)) {
    const list = variableAlias[key]
    if (Array.isArray(list)) {
      result[key] = []
      for (const alias of list) {
        if (alias && alias.id) {
          try {
            const variable: Variable =
              await figma.variables.getVariableByIdAsync(alias.id)
            result[key].push(variable.codeSyntax.WEB)
          } catch (error) {
            console.error("Variable resolution failed:", error)
          }
        }
      }
    }
  }

  return result
}

// 스타일 속성에서 변수가 바인딩된 경우 -> codeSyntax.WEB 값으로 대체
const resolveStyleWithVariables = async (
  style: any,
  boundVariables: SceneNodeMixin["boundVariables"],
): Promise<any> => {
  if (!boundVariables) return style

  const resolvedStyle = { ...style }
  const variableMap = await extractVariable(boundVariables)

  // fills 처리
  if (variableMap.fills && variableMap.fills.length > 0) {
    resolvedStyle.fills = variableMap.fills
  }

  // strokes 처리
  if (variableMap.strokes && variableMap.strokes.length > 0) {
    resolvedStyle.strokes = variableMap.strokes
  }

  return resolvedStyle
}

export const instanceNodeToReactNode = async (
  figmaNode: InstanceNode,
): Promise<any> => {
  const baseStyle = {
    x: figmaNode.x,
    y: figmaNode.y,
    width: figmaNode.width,
    height: figmaNode.height,
    layoutAlign: figmaNode.layoutAlign,
    layoutGrow: figmaNode.layoutGrow,
    layoutSizingHorizontal: figmaNode.layoutSizingHorizontal,
    layoutSizingVertical: figmaNode.layoutSizingVertical,
  }

  const resolvedStyle = await resolveStyleWithVariables(
    baseStyle,
    figmaNode.boundVariables,
  )

  const css = await figmaNode.getCSSAsync()

  return {
    type: figmaNode.name[0].toUpperCase() + figmaNode.name.slice(1),
    props: {
      ...extractProps(figmaNode.componentProperties),
      id: figmaNode.id,
      name: figmaNode.name,
      style: resolvedStyle,
      css,
    },
    boundVariables: figmaNode.boundVariables,
    children: figmaNode.children || [],
  }
}

export const textNodeToReactNode = async (
  figmaNode: TextNode,
): Promise<any> => {
  const baseStyle = {
    x: figmaNode.x,
    y: figmaNode.y,
    width: figmaNode.width,
    height: figmaNode.height,
    fontSize: figmaNode.fontSize,
    fontWeight: figmaNode.fontWeight,
    textAlign: figmaNode.textAlignHorizontal,
    fills: figmaNode.fills,
    fillStyleId: figmaNode.fillStyleId,
    layoutAlign: figmaNode.layoutAlign,
    layoutGrow: figmaNode.layoutGrow,
    layoutSizingHorizontal: figmaNode.layoutSizingHorizontal,
    layoutSizingVertical: figmaNode.layoutSizingVertical,
  }

  const resolvedStyle = await resolveStyleWithVariables(
    baseStyle,
    figmaNode.boundVariables,
  )

  const css = await figmaNode.getCSSAsync()

  return {
    type: "Text",
    props: {
      id: figmaNode.id,
      name: figmaNode.name,
      style: resolvedStyle,
      css,
    },
    children: figmaNode.characters || "",
  }
}

export const rectangleNodeToReactNode = async (
  figmaNode: RectangleNode,
): Promise<any> => {
  const baseStyle = {
    x: figmaNode.x,
    y: figmaNode.y,
    width: figmaNode.width,
    height: figmaNode.height,
    fills: figmaNode.fills,
    fillStyleId: figmaNode.fillStyleId,
    strokes: figmaNode.strokes,
    cornerRadius: figmaNode.cornerRadius,
    layoutAlign: figmaNode.layoutAlign,
    layoutGrow: figmaNode.layoutGrow,
    layoutSizingHorizontal: figmaNode.layoutSizingHorizontal,
    layoutSizingVertical: figmaNode.layoutSizingVertical,
  }

  const resolvedStyle = await resolveStyleWithVariables(
    baseStyle,
    figmaNode.boundVariables,
  )

  const css = await figmaNode.getCSSAsync()

  return {
    type: "Rectangle",
    props: {
      id: figmaNode.id,
      name: figmaNode.name,
      style: resolvedStyle,
      css,
    },
  }
}

export const groupNodeToReactNode = async (
  figmaNode: GroupNode,
): Promise<any> => {
  return {
    type: "Group",
    props: {
      id: figmaNode.id,
      name: figmaNode.name,
    },
    children: figmaNode.children || [],
  }
}

export const frameNodeToReactNode = async (
  figmaNode: FrameNode,
): Promise<any> => {
  const baseStyle = {
    x: figmaNode.x,
    y: figmaNode.y,
    width: figmaNode.width,
    height: figmaNode.height,
    fills: figmaNode.fills,
    strokes: figmaNode.strokes,
    cornerRadius: figmaNode.cornerRadius,
    layoutMode: figmaNode.layoutMode,
    primaryAxisAlignItems: figmaNode.primaryAxisAlignItems,
    counterAxisAlignItems: figmaNode.counterAxisAlignItems,
    primaryAxisSizingMode: figmaNode.primaryAxisSizingMode,
    counterAxisSizingMode: figmaNode.counterAxisSizingMode,
    paddingLeft: figmaNode.paddingLeft,
    paddingRight: figmaNode.paddingRight,
    paddingTop: figmaNode.paddingTop,
    paddingBottom: figmaNode.paddingBottom,
    itemSpacing: figmaNode.itemSpacing,
    layoutAlign: figmaNode.layoutAlign,
    layoutGrow: figmaNode.layoutGrow,
    layoutSizingHorizontal: figmaNode.layoutSizingHorizontal,
    layoutSizingVertical: figmaNode.layoutSizingVertical,
    layoutWrap: figmaNode.layoutWrap,
  }

  const resolvedStyle = await resolveStyleWithVariables(
    baseStyle,
    figmaNode.boundVariables,
  )

  const css = await figmaNode.getCSSAsync()

  return {
    type: "Frame", // div
    props: {
      id: figmaNode.id,
      name: figmaNode.name,
      style: resolvedStyle,
      boundVariables: figmaNode.boundVariables,
      css,
    },
    children: figmaNode.children || [],
  }
}
