import plugin from "tailwindcss/plugin"
import type { CSSRuleObject } from "tailwindcss/types/config"

import { generateColorTokens } from "../tokens/color"
import { generateRadiusTokens } from "../tokens/radius"
import { generateSpacingTokens } from "../tokens/spacing"
import {
  fontWeightTokens,
  generateTypographyTokens,
} from "../tokens/typography"
import { generateUnitTokens } from "../tokens/unit"

const {
  base: colorBase,
  dark: colorDark,
  theme: colorTheme,
} = generateColorTokens()
const { theme: typographyTheme } = generateTypographyTokens()
const { theme: spacingTheme } = generateSpacingTokens()
const { theme: radiusTheme } = generateRadiusTokens()
const { cssVars: unitCssVars } = generateUnitTokens()

export default plugin(
  ({ addBase, addComponents, theme }) => {
    addBase({
      ":root": {
        ...fontWeightTokens,
        ...colorBase,
        ...unitCssVars,
      },
      ".dark": {
        ...colorDark,
      },
    })
    const typography = theme("typography")
    if (typography) {
      addComponents(
        Object.entries(typography).reduce(
          (acc, [key, value]) => {
            acc[`.typography-${key}`] = value
            return acc
          },
          {} as { [key: string]: CSSRuleObject },
        ),
      )
    }
  },
  {
    theme: {
      extend: {
        spacing: spacingTheme,
        borderRadius: radiusTheme,
        colors: colorTheme,
        typography: typographyTheme,
        fontWeight: fontWeightTokens,
      },
    },
  },
)
