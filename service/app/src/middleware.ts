import { NextRequest, NextResponse, userAgent } from "next/server"

import { hasValidSession } from "./entities/auth/utils/cookieUtils"

export const config = {
  matcher: ["/:path*"],
}

export function middleware(request: NextRequest) {
  const { device } = userAgent(request)
  const accept = request.headers.get("accept")
  const isPageNavigation =
    request.method === "GET" && accept?.includes("text/html")

  const isPublicAsset =
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml)$/i.test(
      request.nextUrl.pathname,
    )

  if (
    isPageNavigation &&
    !isPublicAsset &&
    (device.type === "mobile" || device.type === "tablet")
  ) {
    return NextResponse.rewrite(new URL("/mobile", request.url))
  }

  if (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/create")
  ) {
    if (!hasValidSession()) {
      return NextResponse.redirect(
        new URL("/?message=unauthorized", request.url),
      )
    }
  }
  return NextResponse.next()
}
