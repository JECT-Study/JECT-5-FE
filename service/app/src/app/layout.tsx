import "./globals.css"

import { GoogleTagManager } from "@next/third-parties/google"
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
      </body>
    </html>
  )
}
