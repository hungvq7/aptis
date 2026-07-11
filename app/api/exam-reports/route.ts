import { NextResponse } from "next/server"
import { z } from "zod"
import { getCurrentUser } from "@/lib/session/current-user"
import { getTestRepository } from "@/lib/data/provider"
import { SKILLS } from "@/lib/data/types"

const bodySchema = z.object({
  examDate: z.string().min(1),
  testCenter: z.string().min(1),
  questionIdsBySkill: z.record(z.enum(SKILLS), z.array(z.string())),
})

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = bodySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 })
  }

  const totalQuestions = Object.values(parsed.data.questionIdsBySkill).reduce(
    (sum, ids) => sum + ids.length,
    0,
  )
  if (totalQuestions === 0) {
    return NextResponse.json({ error: "Vui lòng chọn ít nhất một câu hỏi" }, { status: 400 })
  }

  const report = await getTestRepository().createExamReport({
    userId: user.id,
    examDate: parsed.data.examDate,
    testCenter: parsed.data.testCenter,
    questionIdsBySkill: parsed.data.questionIdsBySkill,
  })
  return NextResponse.json({ id: report.id })
}
