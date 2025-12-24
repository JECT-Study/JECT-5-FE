import { collectCss } from "../../extract/css"
import { extractTextNodeStyle, extractTextSegments } from "../../extract/text"
import type { TextReactNode } from "../../types/figmaNode"
import { ensureBoundVariables } from "../boundVariables"

export const buildTextNode = async (node: TextNode): Promise<TextReactNode> => {
  const style = extractTextNodeStyle(node)
  const css = await collectCss(node)
  const segments = extractTextSegments(node)

  return {
    type: "Text",
    props: {
      id: node.id,
      name: node.name,
      style,
      css,
      boundVariables: ensureBoundVariables(node),
      characters: node.characters,
      segments,
    },
    children: [],
  }
}
