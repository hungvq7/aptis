import { NextResponse } from "next/server"
import { z } from "zod"
import { getAuthProvider } from "@/lib/data/provider"
import { createSessionToken, setSessionCookie } from "@/lib/auth/session"
import { AuthError } from "@/lib/auth/types"

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 })
  }

  try {
    const user = await getAuthProvider().login(parsed.data)
    const token = await createSessionToken(user)
    await setSessionCookie(token)
    return NextResponse.json({ user })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 })
    }
    throw error
  }
}
