import plugin from "tailwindcss/plugin"
import type { CSSRuleObject } from "tailwindcss/types/config"

import { generateBreakpointTokens } from "../tokens/breakpoint"
import { generateColorTokens } from "../tokens/color"
import { generateRadiusTokens } from "../tokens/radius"
import { generateSpacingTokens } from "../tokens/spacing"
import {
  fontWeightTokens,
  generateTypographyTokens,
} from "../tokens/typography"
import { generateUnitTokens } from "../tokens/unit"
import { generateWidthTokens } from "../tokens/width"

const {
  base: colorBase,
  dark: colorDark,
  theme: colorTheme,
} = generateColorTokens()
const { theme: typographyTheme } = generateTypographyTokens()
const { theme: spacingTheme } = generateSpacingTokens()
const { theme: radiusTheme } = generateRadiusTokens()
const { theme: widthTheme } = generateWidthTokens()
const { theme: breakpointTheme } = generateBreakpointTokens()
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
        screens: breakpointTheme,
        spacing: spacingTheme,
        borderRadius: radiusTheme,
        borderWidth: widthTheme,
        colors: colorTheme,
        typography: typographyTheme,
        fontWeight: fontWeightTokens,
      },
    },
  },
)
