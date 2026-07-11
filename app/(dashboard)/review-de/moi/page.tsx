import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { SubmitExamReportForm } from "@/components/exam-reports/submit-exam-report-form"
import { getCurrentUser } from "@/lib/session/current-user"
import { getTestRepository } from "@/lib/data/provider"
import { SKILLS, type QuestionBankEntry, type Skill } from "@/lib/data/types"

export const metadata: Metadata = {
  title: "Khai báo đề mới — Aptis Prep",
}

export default async function NewExamReportPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/dang-nhap")

  const repository = getTestRepository()
  const entriesList = await Promise.all(SKILLS.map((skill) => repository.listQuestionBankEntries(skill)))
  const entriesBySkill = Object.fromEntries(
    SKILLS.map((skill, index) => [skill, entriesList[index]]),
  ) as Record<Skill, QuestionBankEntry[]>

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">Khai báo đề mới</h1>
        <p className="text-sm text-muted-foreground">
          Chọn ngày thi, cơ sở thi và tick các câu hỏi bạn nhớ đã xuất hiện trong đề thi thật.
        </p>
      </div>
      <SubmitExamReportForm entriesBySkill={entriesBySkill} />
    </div>
  )
}
