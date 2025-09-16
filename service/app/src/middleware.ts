import { NextRequest, NextResponse } from "next/server"

const hasValidSessionFromRequest = (req: NextRequest) => {
  const sid = req.cookies.get("JSESSIONID")?.value
  return !!sid
}

export const config = {
  matcher: ["/dashboard/:path*", "/create/:path*"],
}

export function middleware(request: NextRequest) {
  if (!hasValidSessionFromRequest(request)) {
    return NextResponse.redirect(new URL("/protected", request.url))
  }
  return NextResponse.next()
}
