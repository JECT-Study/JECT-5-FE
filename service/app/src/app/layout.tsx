import "./globals.css"

import { GoogleTagManager } from "@next/third-parties/google"
import { type Metadata } from "next"
import localFont from "next/font/local"
import { ThemeProvider } from "next-themes"

import { MSWProvider } from "../mocks/mswProvider"
import { OverlayProviderWrapper } from "./overlayProvider"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "RE:creation",
  description: "모두가 가볍게 즐길 수 있는 라이트 레크리에이션",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ]
  },
}

const pretendard = localFont({
  src: "../../public/PretendardVariable.woff2",
  weight: "400",
  variable: "--font-pretendard",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={pretendard.variable} suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-MGCJ2489" />
      <body>
        <MSWProvider>
          <Providers>
            <OverlayProviderWrapper>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                {children}
              </ThemeProvider>
            </OverlayProviderWrapper>
          </Providers>
        </MSWProvider>
      </body>
    </html>
  )
}
