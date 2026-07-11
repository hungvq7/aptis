import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { ListOrderedIcon, ShuffleIcon, TimerIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { StartMockExamButton } from "@/components/exam-sessions/start-mock-exam-button"
import { ExamSessionTable, type ExamSessionRow } from "@/components/exam-sessions/exam-session-table"
import { getCurrentUser } from "@/lib/session/current-user"
import { getTestRepository } from "@/lib/data/provider"
import { MOCK_EXAM_SKILL_ORDER, SKILL_META } from "@/lib/data/types"
import { TESTS_BY_SKILL } from "@/lib/data/mock/questions"

export const metadata: Metadata = {
  title: "Thi thử tổng hợp — Aptis Prep",
}

export default async function MockExamPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/dang-nhap")

  const repository = getTestRepository()
  const sessions = await repository.listExamSessionsForUser(user.id)

  const totalDurationMinutes = MOCK_EXAM_SKILL_ORDER.reduce(
    (sum, skill) => sum + TESTS_BY_SKILL[skill][0].durationMinutes,
    0,
  )

  const rows: ExamSessionRow[] = sessions
    .map((session) => {
      const orderedAttemptIds = MOCK_EXAM_SKILL_ORDER.map((skill) => session.attemptIds[skill]).filter(
        (id): id is string => id != null,
      )
      const currentAttemptId = orderedAttemptIds.at(-1)
      if (!currentAttemptId) return null
      return {
        id: session.id,
        startedAt: session.startedAt,
        status: session.status,
        skillsCompleted: orderedAttemptIds.length,
        currentAttemptId,
      }
    })
    .filter((row): row is ExamSessionRow => row !== null)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">Thi thử tổng hợp</h1>
        <p className="text-sm text-muted-foreground">
          Mô phỏng bài thi Aptis thật: làm liên tục cả 4 kỹ năng theo đúng thứ tự thi thật, đề được xáo trộn
          ngẫu nhiên mỗi lần.
        </p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Thứ tự thi</CardTitle>
          <CardDescription>
            {MOCK_EXAM_SKILL_ORDER.map((skill) => SKILL_META[skill].label).join(" → ")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ListOrderedIcon className="size-4 shrink-0" />
            Làm lần lượt từng kỹ năng, nộp bài phần này sẽ tự động chuyển sang phần tiếp theo.
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShuffleIcon className="size-4 shrink-0" />
            Câu hỏi và thứ tự đáp án được xáo trộn ngẫu nhiên mỗi lần thi thử.
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TimerIcon className="size-4 shrink-0" />
            Tổng thời gian khoảng {totalDurationMinutes} phút cho cả 4 phần.
          </div>
          <div>
            <StartMockExamButton />
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="font-heading text-lg font-medium tracking-tight">Lịch sử thi thử</h2>
        <p className="text-sm text-muted-foreground">Các lượt thi thử tổng hợp bạn đã bắt đầu hoặc hoàn thành.</p>
      </div>

      {rows.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShuffleIcon />
            </EmptyMedia>
            <EmptyTitle>Chưa có lượt thi thử nào</EmptyTitle>
            <EmptyDescription>Bắt đầu lượt thi thử đầu tiên để trải nghiệm bài thi mô phỏng.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ExamSessionTable rows={rows} />
      )}
    </div>
  )
}
