import type { GenericReactNode } from "../../types/figmaNode"
import { ensureBoundVariables } from "../boundVariables"

export const buildGenericNode = async (
  node: SceneNode,
): Promise<GenericReactNode> => ({
  type: node.type,
  props: {
    id: node.id,
    name: node.name,
    boundVariables: ensureBoundVariables(node),
    rawType: node.type,
  },
  children: [],
})
