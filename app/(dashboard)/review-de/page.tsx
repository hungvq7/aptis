import Link from "next/link"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { PlusIcon, ClipboardListIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { ExamReportTable, type ExamReportRow } from "@/components/exam-reports/exam-report-table"
import { getCurrentUser } from "@/lib/session/current-user"
import { getTestRepository } from "@/lib/data/provider"
import { SKILLS } from "@/lib/data/types"

export const metadata: Metadata = {
  title: "Review đề — Aptis Prep",
}

export default async function ReviewDePage() {
  const user = await getCurrentUser()
  if (!user) redirect("/dang-nhap")

  const reports = await getTestRepository().listExamReports()

  const rows: ExamReportRow[] = reports.map((report) => ({
    id: report.id,
    examDate: report.examDate,
    testCenter: report.testCenter,
    totalQuestions: SKILLS.reduce((sum, skill) => sum + (report.questionIdsBySkill[skill]?.length ?? 0), 0),
    submittedAt: report.submittedAt,
  }))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-medium tracking-tight">Review đề</h1>
          <p className="text-sm text-muted-foreground">
            Đề thi thật do cộng đồng khai báo lại theo ngày thi và cơ sở thi.
          </p>
        </div>
        <Button asChild>
          <Link href="/review-de/moi">
            <PlusIcon />
            Khai báo đề mới
          </Link>
        </Button>
      </div>

      {rows.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ClipboardListIcon />
            </EmptyMedia>
            <EmptyTitle>Chưa có đề nào được khai báo</EmptyTitle>
            <EmptyDescription>Hãy là người đầu tiên chia sẻ đề thi thật bạn vừa gặp.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ExamReportTable rows={rows} />
      )}
    </div>
  )
}
