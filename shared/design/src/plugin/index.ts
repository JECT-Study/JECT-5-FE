import plugin from "tailwindcss/plugin"
import type { CSSRuleObject } from "tailwindcss/types/config"

import { generateColorTokens } from "../tokens/color"
import {
  fontWeightTokens,
  generateTypographyTokens,
} from "../tokens/typography"

const {
  base: colorBase,
  dark: colorDark,
  theme: colorTheme,
} = generateColorTokens()
const { theme: typographyTheme } = generateTypographyTokens()

export default plugin(
  ({ addBase, addComponents, theme }) => {
    addBase({
      ":root": {
        ...fontWeightTokens,
        ...colorBase,
        ".dark": {
          ...colorDark,
        },
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
        colors: colorTheme,
        typography: typographyTheme,
        fontWeight: fontWeightTokens,
      },
    },
  },
)
