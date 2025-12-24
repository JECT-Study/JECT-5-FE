import { collectCss } from "../../extract/css"
import { extractNodeStyle } from "../../extract/style"
import type { FrameReactNode } from "../../types/figmaNode"
import { ensureBoundVariables } from "../boundVariables"

export const buildFrameNode = async (
  node: FrameNode,
): Promise<FrameReactNode> => {
  const style = extractNodeStyle(node)
  const css = await collectCss(node)

  return {
    type: "Frame",
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
