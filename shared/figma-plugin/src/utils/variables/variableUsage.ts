import type {
  ReactFigmaNode,
  VariableBindingIndex,
  VariableUsageMap,
  VariableUsageSummary,
} from "../../types/figmaNode"
import {
  buildVariableBindingIndex,
  collectVariableUsage,
} from "./variableCollector"

interface VariableCollectionContext {
  bindings: VariableBindingIndex
}

const createVariableCollectionContext = (): VariableCollectionContext => ({
  bindings: new Map(),
})

const mergeBindings = (
  target: VariableBindingIndex,
  source: VariableBindingIndex,
): void => {
  for (const [aliasId, occurrences] of source.entries()) {
    const existing = target.get(aliasId) ?? []
    target.set(aliasId, existing.concat(occurrences))
  }
}

const collectNodeBindings = (
  node: ReactFigmaNode,
  context: VariableCollectionContext,
): VariableBindingIndex => {
  const references = node.props.boundVariables ?? []
  const source = buildVariableBindingIndex([
    {
      nodeId: node.props.id,
      nodeName: node.props.name,
      references,
    },
  ])

  mergeBindings(context.bindings, source)

  if (Array.isArray(node.children) && node.children.length > 0) {
    node.children.forEach((child) => {
      collectNodeBindings(child, context)
    })
  }

  return context.bindings
}

export const collectBindingsFromReactNodes = (
  nodes: ReadonlyArray<ReactFigmaNode>,
): VariableBindingIndex => {
  const context = createVariableCollectionContext()

  nodes.forEach((node) => {
    collectNodeBindings(node, context)
  })

  return context.bindings
}

export const resolveVariableUsageFromReactNodes = async (
  nodes: ReadonlyArray<ReactFigmaNode>,
): Promise<VariableUsageMap> => {
  const bindings = collectBindingsFromReactNodes(nodes)
  return collectVariableUsage(bindings)
}

export const formatVariableUsageRecord = (
  usage: VariableUsageMap,
): Record<string, VariableUsageSummary> => {
  const record: Record<string, VariableUsageSummary> = {}

  usage.forEach((summary, aliasId) => {
    record[aliasId] = summary
  })

  return record
}
