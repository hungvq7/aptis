import { cookies } from "next/headers"
import type { SessionUser } from "@/lib/data/types"
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session"

/** Server-only. Use in Server Components / Route Handlers to read the current user. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return verifySessionToken(token)
}
