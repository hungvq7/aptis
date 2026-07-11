import { NextResponse } from "next/server"
import { z } from "zod"
import { getCurrentUser } from "@/lib/session/current-user"
import { getTestRepository } from "@/lib/data/provider"

const bodySchema = z.object({ testId: z.string() })

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = bodySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 })
  }

  try {
    const attempt = await getTestRepository().createAttempt(user.id, parsed.data.testId)
    return NextResponse.json({ attemptId: attempt.id })
  } catch {
    return NextResponse.json({ error: "Không tìm thấy đề thi" }, { status: 404 })
  }
}
