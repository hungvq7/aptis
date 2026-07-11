import { NextResponse } from "next/server"
import { z } from "zod"
import { getCurrentUser } from "@/lib/session/current-user"
import { getTestRepository } from "@/lib/data/provider"

const bodySchema = z.object({ sourceAttemptId: z.string() })

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = bodySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 })
  }

  const repository = getTestRepository()
  const sourceAttempt = await repository.getAttempt(parsed.data.sourceAttemptId)
  if (!sourceAttempt || sourceAttempt.userId !== user.id) {
    return NextResponse.json({ error: "Không tìm thấy bài làm gốc" }, { status: 404 })
  }

  try {
    const attempt = await repository.createRetryAttempt(user.id, parsed.data.sourceAttemptId)
    return NextResponse.json({ attemptId: attempt.id })
  } catch {
    return NextResponse.json({ error: "Không có câu sai nào để ôn tập" }, { status: 400 })
  }
}
