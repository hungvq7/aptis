import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/session/current-user"
import { getTestRepository } from "@/lib/data/provider"
import { SKILL_META } from "@/lib/data/types"
import { promptTextFor, summarizeCorrectAnswer } from "@/lib/data/question-content"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ reportId: string }>
}): Promise<Metadata> {
  const { reportId } = await params
  return { title: `Đề ngày ${reportId} — Aptis Prep` }
}

export default async function ExamReportDetailPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params
  const user = await getCurrentUser()
  if (!user) redirect("/dang-nhap")

  const detail = await getTestRepository().getExamReportDetail(reportId)
  if (!detail) notFound()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">Đề thi ngày {detail.examDate}</h1>
        <p className="text-sm text-muted-foreground">
          {detail.testCenter} · Gửi lúc {new Date(detail.submittedAt).toLocaleString("vi-VN")}
        </p>
      </div>

      {detail.sections.map((section) => {
        if (section.entries.length === 0) return null
        const grouped = new Map<string, { partTitle: string; entries: typeof section.entries }>()
        for (const entry of section.entries) {
          const group = grouped.get(entry.partId) ?? { partTitle: entry.partTitle, entries: [] }
          group.entries.push(entry)
          grouped.set(entry.partId, group)
        }

        return (
          <Card key={section.skill}>
            <CardHeader>
              <CardTitle className="text-base">{SKILL_META[section.skill].label}</CardTitle>
              <CardDescription>{section.entries.length} câu được ghi nhận</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {Array.from(grouped.values()).map((group) => (
                <div key={group.partTitle} className="flex flex-col gap-3">
                  <h3 className="text-sm font-medium">{group.partTitle}</h3>
                  <div className="flex flex-col gap-2">
                    {group.entries.map((entry) => (
                      <div key={entry.question.id} className="rounded-2xl border border-border/60 p-3 text-sm">
                        <p className="text-pretty">
                          {promptTextFor(entry.question, { id: entry.partId, title: entry.partTitle })}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Đáp án đúng: {summarizeCorrectAnswer(entry.question)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}

      {detail.sections.every((section) => section.entries.length === 0) ? (
        <Badge variant="secondary" className="w-fit">
          Chưa có câu hỏi nào được ghi nhận cho đề này
        </Badge>
      ) : null}
    </div>
  )
}
