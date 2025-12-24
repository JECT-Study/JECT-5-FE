import { collectNodeVariableReferences } from "../utils/variables/variableCollector"

const withBoundVariables = (node: SceneNode) =>
  collectNodeVariableReferences(node)

export const ensureBoundVariables = (
  node: SceneNode,
): ReturnType<typeof collectNodeVariableReferences> | undefined => {
  const references = withBoundVariables(node)
  return references.length > 0 ? references : undefined
}
