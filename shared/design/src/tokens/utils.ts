export function pxToRemFixed(px: number, baseFontSize = 16) {
  const rem = px / baseFontSize
  return parseFloat(rem.toFixed(4))
}

export function convertName(name: string) {
  return name.replaceAll("/", "-")
}

export function convertNameToVar(name: string) {
  return `var(--${convertName(name)})`
}
