import { NextResponse } from "next/server"
import { z } from "zod"
import { getCurrentUser } from "@/lib/session/current-user"
import { getTestRepository } from "@/lib/data/provider"
import { answerSchema } from "@/lib/data/types"

const bodySchema = z.object({ answer: answerSchema })

export async function PATCH(request: Request, { params }: { params: Promise<{ attemptId: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { attemptId } = await params
  const repository = getTestRepository()
  const attempt = await repository.getAttempt(attemptId)
  if (!attempt || attempt.userId !== user.id) {
    return NextResponse.json({ error: "Không tìm thấy bài làm" }, { status: 404 })
  }
  if (attempt.status !== "in-progress") {
    return NextResponse.json({ error: "Bài làm đã được nộp" }, { status: 409 })
  }

  const parsed = bodySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 })
  }

  await repository.saveAnswer(attemptId, parsed.data.answer)
  return NextResponse.json({ ok: true })
}
