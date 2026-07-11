import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { PracticeBrowser } from "@/components/practice/practice-browser"
import { getCurrentUser } from "@/lib/session/current-user"
import { getTestRepository } from "@/lib/data/provider"
import { skillBySlug, SKILL_META } from "@/lib/data/types"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ skill: string }>
}): Promise<Metadata> {
  const { skill: slug } = await params
  const skill = skillBySlug(slug)
  return { title: skill ? `Luyện tập ${SKILL_META[skill].label} — Aptis Prep` : "Aptis Prep" }
}

export default async function PracticeBySkillPage({ params }: { params: Promise<{ skill: string }> }) {
  const { skill: slug } = await params
  const skill = skillBySlug(slug)
  if (!skill) notFound()

  const user = await getCurrentUser()
  if (!user) redirect("/dang-nhap")

  const repository = getTestRepository()
  const [entries, flagSummary] = await Promise.all([
    repository.listQuestionBankEntries(skill),
    repository.getRealExamFlagSummaryForSkill(skill, user.id),
  ])
  const meta = SKILL_META[skill]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          Luyện tập theo câu hỏi — {meta.label}
        </h1>
        <p className="text-sm text-muted-foreground">
          Lọc, tìm kiếm và luyện từng câu hỏi. Không giới hạn thời gian, không tính vào thống kê thi thử.
        </p>
      </div>
      <PracticeBrowser entries={entries} flagSummary={flagSummary} />
    </div>
  )
}
