import type { GroupReactNode } from "../../types/figmaNode"
import { ensureBoundVariables } from "../boundVariables"

export const buildGroupNode = async (
  node: GroupNode,
): Promise<GroupReactNode> => ({
  type: "Group",
  props: {
    id: node.id,
    name: node.name,
    boundVariables: ensureBoundVariables(node),
  },
  children: [],
})
