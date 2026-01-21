import { mapValues } from "es-toolkit"

import { collectCss } from "../../extract/css"
import { extractNodeStyle } from "../../extract/style"
import type {
  InstanceComponentPropertyMap,
  InstanceComponentValueMap,
  InstanceReactNode,
} from "../../types/figmaNode"
import { ensureBoundVariables } from "../boundVariables"

const toInstanceComponentValues = (
  properties: InstanceComponentPropertyMap,
): InstanceComponentValueMap =>
  mapValues(properties, (definition) => definition.value)

export const buildInstanceNode = async (
  node: InstanceNode,
): Promise<InstanceReactNode> => {
  const style = extractNodeStyle(node)
  console.log(node.componentProperties)
  const css = await collectCss(node)
  const componentProperties = node.componentProperties
  const componentValues = toInstanceComponentValues(componentProperties)
  return {
    type: "Instance",
    props: {
      id: node.id,
      name: node.name,
      style,
      css,
      boundVariables: ensureBoundVariables(node),
      componentProperties,
      componentValues,
    },
    children: [],
  }
}
