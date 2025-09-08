import { generateUnitTokens } from "./unit"

export const generateSpacingTokens = () => {
  const { theme } = generateUnitTokens()
  return { theme }
}
