import { collectCss } from "../../extract/css"
import { extractNodeStyle } from "../../extract/style"
import type { RectangleReactNode } from "../../types/figmaNode"
import { ensureBoundVariables } from "../boundVariables"

export const buildRectangleNode = async (
  node: RectangleNode,
): Promise<RectangleReactNode> => {
  const style = extractNodeStyle(node)
  const css = await collectCss(node)

  return {
    type: "Rectangle",
    props: {
      id: node.id,
      name: node.name,
      style,
      css,
      boundVariables: ensureBoundVariables(node),
    },
    children: [],
  }
}
