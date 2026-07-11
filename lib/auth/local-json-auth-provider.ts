import { randomUUID } from "crypto"
import bcrypt from "bcryptjs"
import type { SessionUser } from "@/lib/data/types"
import { usersCollection } from "@/lib/data/mock/collections"
import { AuthError, type AuthProvider } from "@/lib/auth/types"

function toSessionUser(user: { id: string; email: string; name: string }): SessionUser {
  return { id: user.id, email: user.email, name: user.name }
}

export class LocalJsonAuthProvider implements AuthProvider {
  async register(input: { email: string; password: string; name: string }): Promise<SessionUser> {
    const email = input.email.trim().toLowerCase()
    const existing = await usersCollection.findMany((user) => user.email === email)
    if (existing.length > 0) {
      throw new AuthError("Email đã được đăng ký")
    }

    const passwordHash = await bcrypt.hash(input.password, 10)
    const user = await usersCollection.insert({
      id: randomUUID(),
      email,
      name: input.name.trim(),
      passwordHash,
      createdAt: new Date().toISOString(),
    })

    return toSessionUser(user)
  }

  async login(input: { email: string; password: string }): Promise<SessionUser> {
    const email = input.email.trim().toLowerCase()
    const [user] = await usersCollection.findMany((u) => u.email === email)
    if (!user) {
      throw new AuthError("Email hoặc mật khẩu không đúng")
    }
    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash)
    if (!passwordMatches) {
      throw new AuthError("Email hoặc mật khẩu không đúng")
    }
    return toSessionUser(user)
  }

  async getUserById(id: string): Promise<SessionUser | null> {
    const user = await usersCollection.findByKey(id)
    return user ? toSessionUser(user) : null
  }
}
