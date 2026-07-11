import type { SessionUser } from "@/lib/data/types"

export class AuthError extends Error {}

/**
 * Deliberately shaped to mirror what a Frappe/ERPNext-backed implementation
 * would need: `login` maps to Frappe's `/api/method/login` (`usr`/`pwd`
 * fields, which returns a `sid` cookie). A future `ErpnextAuthProvider` would
 * proxy those fields and store the `sid` instead of issuing its own JWT — the
 * interface itself would not need to change, only the session cookie's
 * contents/verification strategy in lib/auth/session.ts.
 */
export interface AuthProvider {
  register(input: { email: string; password: string; name: string }): Promise<SessionUser>
  login(input: { email: string; password: string }): Promise<SessionUser>
  getUserById(id: string): Promise<SessionUser | null>
}
