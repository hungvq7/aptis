import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { CheckCircle2Icon, ClockIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { QuestionReviewList } from "@/components/results/question-review-list"
import { getCurrentUser } from "@/lib/session/current-user"
import { getTestRepository } from "@/lib/data/provider"
import { SKILL_ICONS } from "@/lib/data/skill-icons"
import { MOCK_EXAM_SKILL_ORDER, SKILL_META, type Skill } from "@/lib/data/types"

export const metadata: Metadata = {
  title: "Kết quả thi thử tổng hợp — Aptis Prep",
}

export default async function MockExamResultPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params
  const user = await getCurrentUser()
  if (!user) redirect("/dang-nhap")

  const repository = getTestRepository()
  const session = await repository.getExamSession(sessionId)
  if (!session || session.userId !== user.id) notFound()

  if (session.status !== "completed") {
    const currentSkill = [...MOCK_EXAM_SKILL_ORDER].reverse().find((skill) => session.attemptIds[skill])
    const currentAttemptId = currentSkill ? session.attemptIds[currentSkill] : undefined
    redirect(currentAttemptId ? `/bai-thi/${currentAttemptId}` : "/thi-thu-tong-hop")
  }

  const summary = await repository.getExamSessionSummary(sessionId)
  if (!summary) notFound()

  const skillEntries = MOCK_EXAM_SKILL_ORDER.map((skill) => ({ skill, data: summary.bySkill[skill] })).filter(
    (entry): entry is { skill: Skill; data: NonNullable<(typeof entry)["data"]> } => entry.data != null,
  )
  const overallScorePercent =
    skillEntries.length > 0
      ? Math.round(skillEntries.reduce((sum, entry) => sum + entry.data.result.scorePercent, 0) / skillEntries.length)
      : 0
  const anyNeedsReview = skillEntries.some((entry) => entry.data.result.perPartBreakdown.some((p) => p.needsReview))

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">Kết quả thi thử tổng hợp</h1>
        <p className="text-sm text-muted-foreground">
          Hoàn thành lúc {session.completedAt ? new Date(session.completedAt).toLocaleString("vi-VN") : "—"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>Điểm trung bình</CardDescription>
          <CardTitle className="text-4xl">{overallScorePercent}%</CardTitle>
          <CardDescription>Trung bình cộng điểm 4 kỹ năng</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {skillEntries.map(({ skill, data }) => {
            const Icon = SKILL_ICONS[SKILL_META[skill].icon]
            return (
              <div key={skill} className="flex flex-col gap-1 rounded-2xl border border-border/60 p-3">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="size-3.5" />
                  {SKILL_META[skill].label}
                </span>
                <span className="font-heading text-xl font-medium">{data.result.scorePercent}%</span>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {anyNeedsReview ? (
        <div className="flex items-start gap-2 rounded-2xl border border-border/60 bg-secondary/50 p-4 text-sm text-secondary-foreground">
          <ClockIcon className="mt-0.5 size-4 shrink-0" />
          <p>
            Bài làm có phần Viết/Nói cần con người hoặc AI chấm chi tiết — điểm hiển thị hiện chỉ phản ánh mức độ
            hoàn thành, sẽ được cập nhật khi tính năng chấm điểm chính thức được tích hợp.
          </p>
        </div>
      ) : null}

      {skillEntries.map(({ skill, data }) => {
        const Icon = SKILL_ICONS[SKILL_META[skill].icon]
        return (
          <Card key={skill}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-muted-foreground" />
                <CardTitle className="text-base">{SKILL_META[skill].label}</CardTitle>
              </div>
              <CardDescription>{data.test.title}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phần</TableHead>
                    <TableHead>Điểm</TableHead>
                    <TableHead className="text-right">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.result.perPartBreakdown.map((part) => (
                    <TableRow key={part.partId}>
                      <TableCell className="font-medium">{part.title}</TableCell>
                      <TableCell>
                        {part.scoreRaw}/{part.scoreMax}
                      </TableCell>
                      <TableCell className="text-right">
                        {part.needsReview ? (
                          <Badge variant="secondary">Cần chấm thêm</Badge>
                        ) : (
                          <Badge>
                            <CheckCircle2Icon />
                            Đã chấm tự động
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data.review.length > 0 ? <QuestionReviewList items={data.review} /> : null}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
