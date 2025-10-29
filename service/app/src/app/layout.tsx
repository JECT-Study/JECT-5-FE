import "./globals.css"

import { Toast } from "@ject-5-fe/design/components/toast"
import { GoogleTagManager } from "@next/third-parties/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { type Metadata } from "next"
import localFont from "next/font/local"

import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "RE:creation",
  description: "모두가 가볍게 즐길 수 있는 라이트 레크리에이션",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
}

const pretendard = localFont({
  src: "../../public/PretendardVariable.woff2",
  weight: "400",
  variable: "--font-pretendard",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Noto Color Emoji",
    "sans-serif",
  ],
})

const joyofSinging = localFont({
  src: "../../public/TJJoyofsingingB.otf",
  weight: "700",
  variable: "--font-joyofsinging",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${joyofSinging.variable}`}
      suppressHydrationWarning
    >
      <GoogleTagManager gtmId="GTM-MGCJ2489" />
      <body>
        <Providers>{children}</Providers>
        <Toast />
        <SpeedInsights />
      </body>
    </html>
  )
}
