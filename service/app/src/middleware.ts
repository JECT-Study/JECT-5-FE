import { NextRequest, NextResponse } from "next/server"

import { hasValidSession } from "./entities/auth/utils/cookieUtils"

export const config = {
  matcher: ["/dashboard/:path*", "/create/:path*"],
}

export function middleware(request: NextRequest) {
  if (!hasValidSession()) {
    return NextResponse.redirect(new URL("/?message=unauthorized", request.url))
  }
  return NextResponse.next()
}
