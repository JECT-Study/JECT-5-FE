type SceneNodeWithChildren = SceneNode & { children?: readonly SceneNode[] }

const shouldIncludeChild = (node: SceneNode): boolean => {
  if ("visible" in node) {
    return Boolean(node.visible)
  }

  return true
}

export const getVisibleChildren = (node: SceneNode): SceneNode[] => {
  if (!("children" in node)) {
    return []
  }

  const children = (node as SceneNodeWithChildren).children ?? []
  return children.filter(shouldIncludeChild) as SceneNode[]
}
