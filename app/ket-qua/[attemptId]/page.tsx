import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { CheckCircle2Icon, ClockIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { QuestionReviewList } from "@/components/results/question-review-list"
import { RetryWrongButton } from "@/components/results/retry-wrong-button"
import { getCurrentUser } from "@/lib/session/current-user"
import { getTestRepository } from "@/lib/data/provider"
import { SKILL_META } from "@/lib/data/types"

export const metadata: Metadata = {
  title: "Kết quả — Aptis Prep",
}

export default async function ResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params
  const user = await getCurrentUser()
  if (!user) redirect("/dang-nhap")

  const repository = getTestRepository()
  const attempt = await repository.getAttempt(attemptId)
  if (!attempt || attempt.userId !== user.id) notFound()

  if (attempt.status === "in-progress") {
    redirect(`/bai-thi/${attempt.id}`)
  }

  const [test, result, review] = await Promise.all([
    repository.getTest(attempt.testId),
    repository.getResult(attemptId),
    repository.getAttemptReview(attemptId),
  ])
  if (!test || !result) notFound()

  const needsReview = result.perPartBreakdown.some((part) => part.needsReview)
  const hasWrongQuestions = review.some((item) => !item.isCorrect)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">Kết quả — {test.title}</h1>
        <p className="text-sm text-muted-foreground">
          Kỹ năng {SKILL_META[result.skill].label} · Nộp bài lúc {new Date(result.submittedAt).toLocaleString("vi-VN")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>Điểm tổng</CardDescription>
          <CardTitle className="text-4xl">{result.scorePercent}%</CardTitle>
          <CardDescription>
            {result.scoreRaw}/{result.scoreMax} điểm
          </CardDescription>
        </CardHeader>
      </Card>

      {needsReview ? (
        <div className="flex items-start gap-2 rounded-2xl border border-border/60 bg-secondary/50 p-4 text-sm text-secondary-foreground">
          <ClockIcon className="mt-0.5 size-4 shrink-0" />
          <p>
            Bài làm có phần Viết/Nói cần con người hoặc AI chấm chi tiết — điểm hiển thị hiện chỉ phản ánh mức độ
            hoàn thành, sẽ được cập nhật khi tính năng chấm điểm chính thức được tích hợp.
          </p>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chi tiết theo từng phần</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phần</TableHead>
                <TableHead>Điểm</TableHead>
                <TableHead className="text-right">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.perPartBreakdown.map((part) => (
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
        </CardContent>
      </Card>

      {review.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Xem lại câu trả lời</CardTitle>
            <CardDescription>
              Đối chiếu câu trả lời của bạn với đáp án đúng cho các câu trắc nghiệm, sắp xếp câu, điền khuyết và
              ghép nối.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuestionReviewList items={review} />
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/bang-dieu-khien">Về bảng điều khiển</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/ky-nang/${SKILL_META[result.skill].slug}`}>Luyện tập thêm</Link>
        </Button>
        {hasWrongQuestions ? <RetryWrongButton sourceAttemptId={attemptId} /> : null}
      </div>
    </div>
  )
}
