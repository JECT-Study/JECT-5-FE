import { uniq } from "es-toolkit"

import type {
  BoundVariableReference,
  VariableBindingIndex,
  VariableBindingOccurrence,
  VariableUsageMap,
  VariableUsageSummary,
} from "../../types/figmaNode"

type VariableAliasSource =
  SceneNodeMixin["boundVariables"][keyof SceneNodeMixin["boundVariables"]]

type VariableAliasList = ReadonlyArray<VariableAlias>

const isVariableAlias = (value: unknown): value is VariableAlias => {
  if (!value || typeof value !== "object") {
    return false
  }

  const typeValue = Reflect.get(value, "type")
  const idValue = Reflect.get(value, "id")

  return typeValue === "VARIABLE_ALIAS" && typeof idValue === "string"
}

const ensureAliasList = (
  source: VariableAliasSource | undefined,
): VariableAliasList => {
  if (!source) {
    return []
  }

  if (Array.isArray(source)) {
    return source.filter(isVariableAlias)
  }

  return isVariableAlias(source) ? [source] : []
}

const toAliasIdList = (aliases: VariableAliasList): string[] =>
  uniq(aliases.map((alias) => alias.id))

export const collectBoundVariableReferences = (
  boundVariables: SceneNodeMixin["boundVariables"] | undefined,
): BoundVariableReference[] => {
  if (!boundVariables) {
    return []
  }

  const references: BoundVariableReference[] = []

  for (const property in boundVariables) {
    const aliasIds = toAliasIdList(ensureAliasList(boundVariables[property]))
    if (aliasIds.length === 0) {
      continue
    }

    references.push({ property, aliasIds })
  }

  return references
}

export const collectNodeVariableReferences = (
  node: SceneNode,
): BoundVariableReference[] =>
  collectBoundVariableReferences(node.boundVariables)

export interface VariableBindingSource {
  nodeId: SceneNode["id"]
  nodeName: string
  references: ReadonlyArray<BoundVariableReference>
}

export const buildVariableBindingIndex = (
  sources: ReadonlyArray<VariableBindingSource>,
): VariableBindingIndex => {
  const index: VariableBindingIndex = new Map()

  sources.forEach((source) => {
    source.references.forEach((reference) => {
      reference.aliasIds.forEach((aliasId) => {
        const occurrences = index.get(aliasId) ?? []
        const occurrence: VariableBindingOccurrence = {
          nodeId: source.nodeId,
          nodeName: source.nodeName,
          property: reference.property,
        }
        occurrences.push(occurrence)
        index.set(aliasId, occurrences)
      })
    })
  })

  return index
}

const resolveVariableCode = async (
  aliasId: string,
): Promise<string | undefined> => {
  try {
    const variable = await figma.variables.getVariableByIdAsync(aliasId)
    if (!variable) {
      return undefined
    }

    return variable.codeSyntax.WEB
  } catch (error) {
    console.warn(`Failed to resolve variable ${aliasId}:`, error)
    return undefined
  }
}

const toUsageSummary = (
  aliasId: string,
  occurrences: ReadonlyArray<VariableBindingOccurrence>,
  code: string,
): VariableUsageSummary => {
  const usedIn = occurrences.map(
    (occurrence) => `${occurrence.nodeName}.${occurrence.property}`,
  )

  return {
    id: aliasId,
    name: code,
    usedIn,
  }
}

export const collectVariableUsage = async (
  bindings: VariableBindingIndex,
): Promise<VariableUsageMap> => {
  const usageMap: VariableUsageMap = new Map()

  for (const [aliasId, occurrences] of bindings.entries()) {
    const code = await resolveVariableCode(aliasId)
    if (!code) {
      continue
    }

    usageMap.set(aliasId, toUsageSummary(aliasId, occurrences, code))
  }

  return usageMap
}
