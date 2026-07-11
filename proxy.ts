import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session"

// IMPORTANT: this file runs on the Edge runtime. It must only import
// lib/auth/session.ts (jose + NextRequest/NextResponse cookies — both
// Edge-safe), never lib/data/mock/store.ts (uses Node's `fs`).
const PROTECTED_PREFIXES = [
  "/bang-dieu-khien",
  "/ky-nang",
  "/ho-so",
  "/bai-thi",
  "/ket-qua",
  "/thong-ke",
  "/review-de",
  "/thi-thu-tong-hop",
]
const AUTH_ONLY_PATHS = ["/dang-nhap", "/dang-ky"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const sessionUser = token ? await verifySessionToken(token) : null

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  if (isProtected && !sessionUser) {
    const loginUrl = new URL("/dang-nhap", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const isAuthOnly = AUTH_ONLY_PATHS.some((path) => pathname.startsWith(path))
  if (isAuthOnly && sessionUser) {
    return NextResponse.redirect(new URL("/bang-dieu-khien", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/bang-dieu-khien/:path*",
    "/ky-nang/:path*",
    "/ho-so/:path*",
    "/bai-thi/:path*",
    "/ket-qua/:path*",
    "/thong-ke/:path*",
    "/review-de/:path*",
    "/thi-thu-tong-hop/:path*",
    "/dang-nhap",
    "/dang-ky",
  ],
}
