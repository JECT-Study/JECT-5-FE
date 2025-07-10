/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/**
 * RGB 값을 Hex 색상 코드로 변환합니다.
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (value: number): string => {
    const hex = Math.round(value * 255).toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Variable ID로부터 Variable Name을 가져옵니다.
 */
function getVariableName(variableId: string): string | null {
  try {
    const variable = figma.variables.getVariableById(variableId)
    return variable ? variable.name : null
  } catch (error) {
    return null
  }
}

/**
 * BoundVariables에서 특정 속성의 Variable Name을 추출합니다.
 */
function getVariableNameForProperty(
  node: any,
  propertyName: string,
): string | null {
  try {
    if (node.boundVariables && node.boundVariables[propertyName]) {
      const binding = node.boundVariables[propertyName]
      if (binding && binding.type === "VARIABLE_ALIAS" && binding.id) {
        return getVariableName(binding.id)
      }
    }
    return null
  } catch (error) {
    return null
  }
}

/**
 * Figma 노드 타입을 목표 XML의 태그 이름 규칙에 맞게 변환합니다.
 */
function getNodeTagName(nodeType: string): string {
  if (!nodeType) return "unknown"
  if (nodeType === "COMPONENT_SET") {
    return "component_set"
  }
  // "TEXT" -> "Text", "VECTOR" -> "Vector" 등 첫 글자만 대문자로
  const lower = nodeType.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

/**
 * XML 속성으로 변환할 수 있는 값인지 확인합니다.
 * figma.mixed 값은 속성으로 변환하지 않습니다.
 */
function isValidAttributeValue(value: any): boolean {
  return (
    value !== null &&
    value !== undefined &&
    value !== figma.mixed &&
    typeof value !== "object"
  )
}

/**
 * 문자열을 XML 안전한 형태로 이스케이프합니다.
 */
function escapeXml(str: string): string {
  return str.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case "&":
        return "&amp;"
      case '"':
        return "&quot;"
      case "'":
        return "&#39;"
      default:
        return char
    }
  })
}

/**
 * 객체의 속성들을 XML 속성 문자열로 변환합니다.
 */
function objectToAttributeString(obj: any): string {
  if (!obj || typeof obj !== "object") return ""

  const attrs: string[] = []
  for (const key in obj) {
    if (obj.hasOwn(key)) {
      const value = obj[key]
      // 중첩된 객체나 배열은 속성으로 변환하지 않습니다.
      if (isValidAttributeValue(value)) {
        const cleanKey = key.replace(/[:#]/g, "_")
        attrs.push(`${cleanKey}="${escapeXml(String(value))}"`)
      }
    }
  }
  return attrs.join(" ")
}

/**
 * SceneNode를 XML 문자열로 변환합니다.
 */
function nodeToXml(node: SceneNode, indent = ""): string {
  if (!node || typeof node === "symbol" || node === figma.mixed) {
    return ""
  }

  const tagName = getNodeTagName(node.type)
  const attributes: string[] = []
  const childElements: string[] = [] // 자식 요소들을 모으는 배열

  // 1. 기본 속성들을 XML 속성으로 변환
  const attributeProperties: string[] = [
    "id",
    "name",
    "visible",
    "locked",
    "opacity",
    "blendMode",
    "isMask",
    "expanded",
    "maskType",
    "x",
    "y",
    "width",
    "height",
    "rotation",
    "targetAspectRatio",
    "layoutAlign",
    "layoutGrow",
    "layoutSizingHorizontal",
    "layoutSizingVertical",
    "layoutPositioning",
    "strokeWeight",
    "strokeAlign",
    "strokeCap",
    "strokeJoin",
    "strokeMiterLimit",
    "cornerRadius",
    "cornerSmoothing",
    "topLeftRadius",
    "topRightRadius",
    "bottomLeftRadius",
    "bottomRightRadius",
    "fontSize",
    "fontWeight",
    "textCase",
    "textDecoration",
    "textAlignHorizontal",
    "textAlignVertical",
    "paragraphIndent",
    "paragraphSpacing",
    "listSpacing",
    "hangingPunctuation",
    "hangingList",
    "characters",
    "hyperlink",
    "textAutoResize",
    "textTruncation",
    "maxLines",
    "leadingTrim",
    "layoutMode",
    "layoutWrap",
    "primaryAxisSizingMode",
    "counterAxisSizingMode",
    "primaryAxisAlignItems",
    "counterAxisAlignItems",
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "paddingBottom",
    "itemSpacing",
    "counterAxisSpacing",
    "clipsContent",
    "type",
    "scaleFactor",
    "minWidth",
    "maxWidth",
    "minHeight",
    "maxHeight",
    "counterAxisAlignContent",
    "devStatus",
    "fillStyleId",
    "strokeStyleId",
    "textStyleId",
    "effectStyleId",
    "gridStyleId",
    "backgroundStyleId",
    "itemReverseZIndex",
    "flexWrap",
    "absolutePositioning",
    "overflowDirection",
    "sectionContentsStatus",
    "isExposedInstance",
    "lockedContent",
    "version",
    "description",
  ]

  // 속성 처리 - 안전하게 접근하고 Variable Name도 추가
  attributeProperties.forEach((key) => {
    try {
      if (key in node && node[key] !== figma.mixed) {
        const value = node[key]
        if (isValidAttributeValue(value)) {
          attributes.push(`${key}="${escapeXml(String(value))}"`)

          // Variable Name 추가 검사
          const variableName = getVariableNameForProperty(node, key)
          if (variableName) {
            attributes.push(`${key}VariableName="${escapeXml(variableName)}"`)
          }
        }
      }
    } catch (error: any) {
      console.log(error)
      // Figma API 접근 권한 또는 노드 타입에 따라 접근 불가한 속성은 경고만 출력하고 건너뜀
    }
  })

  // 'componentPropertyDefinitions' 특수 처리: COMPONENT_SET 노드만 접근 가능
  if (node.type === "COMPONENT_SET" && "componentPropertyDefinitions" in node) {
    try {
      const definitions = (node as ComponentSetNode)
        .componentPropertyDefinitions
      if (
        definitions &&
        typeof definitions === "object" &&
        Object.keys(definitions).length > 0
      ) {
        const defElements: string[] = []
        for (const propName in definitions) {
          if (definitions.hasOwn(propName)) {
            const definition = definitions[propName]
            const defAttrs = objectToAttributeString(definition)
            // variantOptions도 자식 요소로 처리 (예시 XML처럼)
            let variantOptionsContent = ""
            if (
              definition.type === "VARIANT" &&
              definition.variantOptions &&
              definition.variantOptions.length > 0
            ) {
              const options = definition.variantOptions
                .map(
                  (opt: { value: string; index: number }) =>
                    `${indent}          <variantOption value="${escapeXml(opt.value)}" index="${opt.index}" />`,
                )
                .join("\n")
              variantOptionsContent = `\n${indent}        <variantOptions>\n${options}\n${indent}        </variantOptions>`
            }

            if (variantOptionsContent) {
              defElements.push(
                `${indent}    <componentPropertyDefinition name="${escapeXml(propName)}" ${defAttrs}>${variantOptionsContent}\n${indent}    </componentPropertyDefinition>`,
              )
            } else {
              defElements.push(
                `${indent}    <componentPropertyDefinition name="${escapeXml(propName)}" ${defAttrs} />`,
              )
            }
          }
        }
        if (defElements.length > 0) {
          childElements.push(
            `${indent}  <componentPropertyDefinitions>\n${defElements.join("\n")}\n${indent}  </componentPropertyDefinitions>`,
          )
        }
      }
    } catch (error: any) {
      // console.warn(`[WARN] componentPropertyDefinitions 접근 불가 (${node.type} 노드): ${error.message}`);
    }
  }

  // 2. 자식 노드들 처리
  if (
    node.children &&
    Array.isArray(node.children) &&
    node.children.length > 0
  ) {
    const childrenContent = node.children
      .map((child: SceneNode) => nodeToXml(child, indent + "    "))
      .filter(Boolean)
      .join("\n")

    if (childrenContent) {
      childElements.push(
        `${indent}  <children>\n${childrenContent}\n${indent}  </children>`,
      )
    }
  }

  // 3. 복잡한 속성들을 자식 요소로 처리
  const complexProperties = [
    "fills",
    "strokes",
    "effects",
    "constraints",
    "fontName",
    "letterSpacing",
    "lineHeight",
    "textDecorationColor",
    "variantProperties",
    "mainComponent",
    "componentProperties",
    "overrides",
    "dashPattern",
    "imageTransform",
    "filters",
    "defaultVariant",
    "variantGroupProperties",
    "boundVariables",
    "backgrounds",
    "exportSettings",
    "overlayBackground",
    "devUrl",
    "prototypeStartNodeId",
  ]

  complexProperties.forEach((key) => {
    try {
      if (
        key in node &&
        node[key] !== null &&
        node[key] !== undefined &&
        node[key] !== figma.mixed
      ) {
        const value = node[key]

        if (key === "fills" || key === "strokes" || key === "backgrounds") {
          if (Array.isArray(value) && value.length > 0) {
            const paintElements = value.map((paint: any, index: number) => {
              const paintAttrs: string[] = []

              Object.keys(paint).forEach((paintKey) => {
                if (
                  paintKey !== "color" &&
                  paintKey !== "imageTransform" &&
                  paintKey !== "filters"
                ) {
                  const paintValue = paint[paintKey]
                  if (isValidAttributeValue(paintValue)) {
                    paintAttrs.push(
                      `${paintKey}="${escapeXml(String(paintValue))}"`,
                    )
                  }
                }
              })

              // 색상 처리
              if (paint.color) {
                paintAttrs.push(
                  `color="${rgbToHex(paint.color.r, paint.color.g, paint.color.b)}"`,
                )

                // 색상에 대한 Variable Name 추가
                const colorVariableName = getVariableNameForProperty(node, key)
                if (colorVariableName) {
                  paintAttrs.push(
                    `colorVariableName="${escapeXml(colorVariableName)}"`,
                  )
                }
              }

              let paintContent = ""
              // imageTransform 처리
              if (paint.imageTransform) {
                paintContent += `${indent}        <imageTransform matrix="${paint.imageTransform.join(",")}" />\n`
              }
              // filters 처리
              if (paint.filters) {
                const filterAttrs = objectToAttributeString(paint.filters)
                paintContent += `${indent}        <filters ${filterAttrs} />\n`
              }

              const paintTag = key.slice(0, -1)
              const paintAttrString =
                paintAttrs.length > 0 ? " " + paintAttrs.join(" ") : ""

              if (paintContent) {
                return `${indent}      <${paintTag}${paintAttrString}>\n${paintContent}${indent}      </${paintTag}>`
              } else {
                return `${indent}      <${paintTag}${paintAttrString} />`
              }
            })

            childElements.push(
              `${indent}    <${key}>\n${paintElements.join("\n")}\n${indent}    </${key}>`,
            )
          }
        } else if (key === "boundVariables") {
          if (typeof value === "object" && value !== null) {
            const variableElements: string[] = []
            for (const propName in value) {
              if (value.hasOwn(propName)) {
                const variableBinding = value[propName]
                if (
                  variableBinding &&
                  typeof variableBinding === "object" &&
                  variableBinding.type === "VARIABLE_ALIAS"
                ) {
                  const varName = getVariableName(variableBinding.id)
                  const nameAttr = varName
                    ? ` name="${escapeXml(varName)}"`
                    : ""
                  variableElements.push(
                    `${indent}    <variable binding="${escapeXml(propName)}" id="${escapeXml(variableBinding.id)}"${nameAttr} />`,
                  )
                }
              }
            }
            if (variableElements.length > 0) {
              childElements.push(
                `${indent}  <boundVariables>\n${variableElements.join("\n")}\n${indent}  </boundVariables>`,
              )
            }
          }
        } else if (key === "exportSettings") {
          if (Array.isArray(value) && value.length > 0) {
            const exportElements = value.map((setting: any) => {
              const settingAttrs = objectToAttributeString(setting)
              return `${indent}    <exportSetting ${settingAttrs} />`
            })
            childElements.push(
              `${indent}  <exportSettings>\n${exportElements.join("\n")}\n${indent}  </exportSettings>`,
            )
          }
        } else if (key === "variantGroupProperties") {
          // variantGroupProperties 특수 처리
          if (typeof value === "object" && value !== null) {
            const groupElements: string[] = []
            for (const groupName in value) {
              if (value.hasOwn(groupName)) {
                const group = value[groupName]
                if (
                  group.values &&
                  Array.isArray(group.values) &&
                  group.values.length > 0
                ) {
                  const valueElements = group.values
                    .map(
                      (val: { value: string; index: number }) =>
                        `${indent}      <value value="${escapeXml(val.value)}" index="${val.index}" />`,
                    )
                    .join("\n")
                  groupElements.push(
                    `${indent}    <${escapeXml(groupName)}>\n${valueElements}\n${indent}    </${escapeXml(groupName)}>`,
                  )
                }
              }
            }
            if (groupElements.length > 0) {
              childElements.push(
                `${indent}  <variantGroupProperties>\n${groupElements.join("\n")}\n${indent}  </variantGroupProperties>`,
              )
            }
          }
        } else if (typeof value === "object" && !Array.isArray(value)) {
          const attrString = objectToAttributeString(value)
          if (attrString) {
            childElements.push(`${indent}  <${key} ${attrString} />`)
          }
        } else if (Array.isArray(value) && value.length > 0) {
          const arrayElements = value.map((item: any) => {
            const itemAttrs = objectToAttributeString(item)
            return `${indent}    <${key.slice(0, -1)} ${itemAttrs} />`
          })
          childElements.push(
            `${indent}  <${key}>\n${arrayElements.join("\n")}\n${indent}  </${key}>`,
          )
        }
      }
    } catch (error: any) {
      // console.warn(`[WARN] 복합 속성 '${key}' 접근 불가 (${node.type} 노드): ${error.message}`);
    }
  })

  // XML 생성
  const attrString = attributes.length > 0 ? " " + attributes.join(" ") : ""
  const hasChildren = childElements.length > 0

  if (hasChildren) {
    return `${indent}<${tagName}${attrString}>\n${childElements.join("\n")}\n${indent}</${tagName}>`
  } else {
    return `${indent}<${tagName}${attrString} />`
  }
}

/**
 * 선택된 Figma 노드를 최종 XML 문자열로 변환합니다.
 */
export function convertNodeToXML(selectedNodes: readonly SceneNode[]): string {
  if (!selectedNodes || !selectedNodes.length) {
    return '<?xml version="1.0" encoding="UTF-8"?>\n\n<root />'
  }

  try {
    const xmlNodes = selectedNodes
      .map((node) => nodeToXml(node))
      .filter(Boolean)
      .join("\n")

    return `<?xml version="1.0" encoding="UTF-8"?>\n<?figml version="1.0"?>\n${xmlNodes}`
  } catch (error) {
    console.error("XML 변환 중 오류 발생:", error)
    return '<?xml version="1.0" encoding="UTF-8"?>\n\n<error>변환 실패</error>'
  }
}
