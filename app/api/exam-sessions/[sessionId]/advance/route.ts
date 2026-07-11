import { NextResponse } from "next/server"
import { z } from "zod"
import { getCurrentUser } from "@/lib/session/current-user"
import { getTestRepository } from "@/lib/data/provider"
import { SKILLS } from "@/lib/data/types"

const bodySchema = z.object({ finishedSkill: z.enum(SKILLS) })

export async function POST(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = bodySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 })
  }

  const { sessionId } = await params
  const repository = getTestRepository()
  const session = await repository.getExamSession(sessionId)
  if (!session || session.userId !== user.id) {
    return NextResponse.json({ error: "Không tìm thấy phiên thi thử" }, { status: 404 })
  }

  const outcome = await repository.advanceExamSession(sessionId, parsed.data.finishedSkill)
  return NextResponse.json(outcome)
}
