import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { SessionUser } from "@/lib/data/types"

// jose runs on both the Node and Edge runtimes, so this same
// createSessionToken/verifySessionToken pair works from Route Handlers
// (Node) and from middleware.ts (Edge) — bcrypt-based password hashing, by
// contrast, only ever runs inside Route Handlers.
export const SESSION_COOKIE_NAME = "aptis_session"
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60

function getSecretKey() {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET environment variable must be set in production")
    }
    // Dev-only fallback so `npm run dev` works without extra setup. Never used in production.
    return new TextEncoder().encode("dev-only-insecure-secret-change-me")
  }
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey())
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null
    }
    return { id: payload.sub, email: payload.email, name: payload.name }
  } catch {
    return null
  }
}

export async function setSessionCookie(token: string) {
  const store = await cookies()
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  })
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.delete(SESSION_COOKIE_NAME)
}
