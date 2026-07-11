import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { QuestionTypeStatsChartLoader } from "@/components/stats/question-type-stats-chart-loader"
import { ChartColumnIcon } from "lucide-react"
import { getCurrentUser } from "@/lib/session/current-user"
import { getTestRepository } from "@/lib/data/provider"

export const metadata: Metadata = {
  title: "Thống kê điểm yếu — Aptis Prep",
}

export default async function StatsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/dang-nhap")

  const stats = await getTestRepository().getQuestionTypeStats(user.id)
  const hasAnyData = stats.some((stat) => stat.total > 0)

  const objectiveStats = stats.filter((stat) => !stat.isCompletionOnly)
  const completionStats = stats.filter((stat) => stat.isCompletionOnly && stat.total > 0)
  const weakest = objectiveStats.find((stat) => stat.total > 0 && stat.accuracyPercent !== null)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">Thống kê điểm yếu</h1>
        <p className="text-sm text-muted-foreground">
          Độ chính xác của bạn theo từng dạng câu hỏi, tổng hợp từ các lượt làm bài đã chấm điểm.
        </p>
      </div>

      {!hasAnyData ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ChartColumnIcon />
            </EmptyMedia>
            <EmptyTitle>Chưa có dữ liệu</EmptyTitle>
            <EmptyDescription>Hoàn thành ít nhất một bài thi để xem thống kê điểm yếu của bạn.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Độ chính xác theo dạng câu hỏi</CardTitle>
              <CardDescription>
                {weakest
                  ? `Bạn nên luyện thêm: ${weakest.label} (${weakest.accuracyPercent}%)`
                  : "Chưa có đủ dữ liệu cho các dạng câu hỏi khách quan."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuestionTypeStatsChartLoader stats={stats} />
            </CardContent>
          </Card>

          {completionStats.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tỷ lệ hoàn thành</CardTitle>
                <CardDescription>
                  Các dạng Viết/Nói cần chấm thủ công — số liệu dưới đây chỉ phản ánh mức độ hoàn thành, không phải
                  độ chính xác.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {completionStats.map((stat) => (
                  <div key={stat.questionType} className="flex items-center justify-between text-sm">
                    <span>{stat.label}</span>
                    <span className="text-muted-foreground">{stat.accuracyPercent}% hoàn thành</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </>
      )}
    </div>
  )
}
