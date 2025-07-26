import type { CSSRuleObject } from "tailwindcss/types/config"

import { convertName, convertNameToVar } from "./utils"
import variables from "./variables.json"

//현재 primitive / semantic 컬렉션을 사용하고있어, 이 모드에만 대응하는 코드로 추후 모드 추가 시 수정 필요
//타입 불일치 시 Error 발생

const primitiveColorCollection = variables.collections.find(
  (collection) => collection.name === "primitive",
)

const semanticColorCollection = variables.collections.find(
  (collection) => collection.name === "semantic",
)

if (!primitiveColorCollection || !semanticColorCollection) {
  throw new Error("Collection not found")
}

const primitiveColor = primitiveColorCollection.modes[0].variables.reduce(
  (acc, variable) => {
    if (typeof variable.value === "object") {
      throw new Error("primitive color is not string")
    }
    const name = `--${convertName(variable.name)}`
    acc[name] = variable.value as string
    return acc
  },
  {} as Record<string, string>,
)

const semanticColorLight = semanticColorCollection.modes
  .filter((mode) => mode.name === "light")[0]
  .variables.reduce(
    (acc, variable) => {
      if (typeof variable.value !== "object" || !("name" in variable.value)) {
        throw new Error("semantic color alias value should have name property")
      }
      const key = `--${convertName(variable.name)}`
      const valueName = variable.value.name
      const value = convertNameToVar(valueName)
      acc[key] = value
      return acc
    },
    {} as Record<string, string>,
  )

const semanticColorDark = semanticColorCollection.modes
  .filter((mode) => mode.name === "dark")[0]
  .variables.reduce(
    (acc, variable) => {
      if (typeof variable.value !== "object" || !("name" in variable.value)) {
        throw new Error("semantic color alias value should have name property")
      }
      const key = `--${convertName(variable.name)}`
      const valueName = variable.value.name
      const value = convertNameToVar(valueName)
      acc[key] = value
      return acc
    },
    {} as Record<string, string>,
  )

const removeColorPrefix = (cssVar: string) => {
  const prefix = "--color-"
  if (cssVar.startsWith(prefix)) {
    return cssVar.slice(prefix.length)
  }
  return cssVar
}

export const generateColorTokens = () => {
  const base: CSSRuleObject = {
    ...primitiveColor,
    ...semanticColorLight,
  }

  const dark = semanticColorDark

  const theme = {
    ...Object.keys(primitiveColor).reduce(
      (acc, _key) => {
        const key = _key.replace("--", "")
        const value = `var(${_key})`
        acc[key] = value
        return acc
      },
      {} as Record<string, string>,
    ),
    ...Object.keys(semanticColorLight).reduce(
      (acc, _key) => {
        const key = removeColorPrefix(_key)
        const value = `var(${_key})`
        acc[key] = value
        return acc
      },
      {} as Record<string, string>,
    ),
  }

  return { base, dark, theme }
}
