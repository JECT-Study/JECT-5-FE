import { js2xml } from "xml-js"

export async function convertNodeToXML(
  selectedNodes: readonly SceneNode[],
): Promise<string> {
  if (!selectedNodes || !selectedNodes.length) {
    return "<root />"
  }

  const processNode = (node: SceneNode): any => {
    if (!node) {
      return null
    }

    const attributes: any = {}

    const flattenValue = (prefix: string, value: any) => {
      if (
        value === figma.mixed ||
        typeof value === "symbol" ||
        typeof value === "function"
      ) {
        return
      }

      if (typeof value === "object" && value !== null) {
        if (Array.isArray(value)) {
          if (value.length === 0) {
            attributes[prefix] = "[]"
          } else {
            value.forEach((item, i) => {
              flattenValue(`${prefix}_${i}`, item)
            })
          }
        } else {
          const keys = Object.keys(value)
          if (keys.length === 0) {
            attributes[prefix] = "{}"
          } else {
            for (const key in value) {
              if (Object.hasOwn(value, key)) {
                flattenValue(`${prefix}_${key}`, value[key])
              }
            }
          }
        }
      } else {
        attributes[prefix] = value
      }
    }

    const propertiesToExtract = [
      "id",
      "name",
      "visible",
      "locked",
      "opacity",
      "blendMode",
      "isMask",
      "effects",
      "effectStyleId",
      "relativeTransform",
      "x",
      "y",
      "width",
      "height",
      "rotation",
      "layoutAlign",
      "layoutGrow",
      "absoluteBoundingBox",
      "absoluteRenderBounds",
      "constrainProportions",
      "layoutMode",
      "primaryAxisSizingMode",
      "counterAxisSizingMode",
      "primaryAxisAlignItems",
      "counterAxisAlignItems",
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
      "itemSpacing",
      "fills",
      "strokes",
      "strokeWeight",
      "strokeAlign",
      "strokeCap",
      "strokeJoin",
      "dashPattern",
      "fillStyleId",
      "strokeStyleId",
      "cornerRadius",
      "cornerSmoothing",
      "topLeftRadius",
      "topRightRadius",
      "bottomLeftRadius",
      "bottomRightRadius",
      "characters",
      "fontSize",
      "fontName",
      "fontWeight",
      "textCase",
      "textDecoration",
      "textAlignHorizontal",
      "textAlignVertical",
      "lineHeight",
      "letterSpacing",
      "mainComponent",
    ]

    propertiesToExtract.forEach((key) => {
      if (key in node) {
        flattenValue(key, (node as any)[key])
      }
    })

    attributes["type"] = node.type

    const children =
      "children" in node &&
      node.type !== "COMPONENT" &&
      node.type !== "INSTANCE"
        ? node.children.map(processNode).filter((child) => child !== null)
        : []

    return {
      type: "element",
      name: node.type,
      attributes,
      elements: children.length > 0 ? children : undefined,
    }
  }

  const processedData = selectedNodes
    .map(processNode)
    .filter((data) => data !== null)

  const dataForXml = {
    elements: [
      {
        type: "element",
        name: "root",
        elements: processedData,
      },
    ],
  }

  const options = {
    spaces: 2,
  }

  const xmlResult = js2xml(dataForXml, options)

  return xmlResult
}
