import { NextRequest, NextResponse, userAgent } from "next/server"

import { hasValidSession } from "./entities/auth/utils/cookieUtils"

export const config = {
  matcher: ["/:path*"],
}

export function middleware(request: NextRequest) {
  const { device } = userAgent(request)
  if (device.type === "mobile") {
    request.nextUrl.pathname = "/mobile"
    return NextResponse.rewrite(request.nextUrl)
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
