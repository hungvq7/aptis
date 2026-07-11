import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session/current-user"
import { getTestRepository } from "@/lib/data/provider"

export async function POST(_request: Request, { params }: { params: Promise<{ attemptId: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { attemptId } = await params
  const repository = getTestRepository()
  const attempt = await repository.getAttempt(attemptId)
  if (!attempt || attempt.userId !== user.id) {
    return NextResponse.json({ error: "Không tìm thấy bài làm" }, { status: 404 })
  }

  if (attempt.status === "in-progress") {
    const result = await repository.submitAttempt(attemptId)
    return NextResponse.json({ result })
  }

  const result = await repository.getResult(attemptId)
  return NextResponse.json({ result })
}
