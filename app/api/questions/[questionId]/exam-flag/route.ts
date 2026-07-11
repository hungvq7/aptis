import { NextResponse } from "next/server"
import { z } from "zod"
import { getCurrentUser } from "@/lib/session/current-user"
import { getTestRepository } from "@/lib/data/provider"

const bodySchema = z.object({ testId: z.string() })

export async function POST(request: Request, { params }: { params: Promise<{ questionId: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { questionId } = await params
  const parsed = bodySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 })
  }

  const summary = await getTestRepository().toggleRealExamFlag(user.id, questionId, parsed.data.testId)
  return NextResponse.json(summary)
}
