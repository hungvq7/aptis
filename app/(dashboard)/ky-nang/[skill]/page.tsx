import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { ListFilterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ExamTestTable, type ExamTestRow } from "@/components/tests/exam-test-table"
import { SkillBanner } from "@/components/tests/skill-banner"
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
  return { title: skill ? `${SKILL_META[skill].label} — Aptis Prep` : "Aptis Prep" }
}

export default async function SkillTestsPage({ params }: { params: Promise<{ skill: string }> }) {
  const { skill: slug } = await params
  const skill = skillBySlug(slug)
  if (!skill) notFound()

  const user = await getCurrentUser()
  if (!user) redirect("/dang-nhap")

  const repository = getTestRepository()
  const [tests, attempts] = await Promise.all([
    repository.listTests(skill),
    repository.listAttemptsForUser(user.id, skill),
  ])
  const flagSummaries = await Promise.all(
    tests.map((test) => repository.getRealExamFlagSummary(test.id, user.id)),
  )

  const meta = SKILL_META[skill]

  const rows: ExamTestRow[] = tests.map((test, index) => ({
    test,
    inProgressAttemptId:
      attempts.find((attempt) => attempt.testId === test.id && attempt.status === "in-progress")?.id ?? null,
    flagSummary: flagSummaries[index],
  }))

  return (
    <div className="flex flex-col gap-6">
      <SkillBanner skill={skill} />

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ListFilterIcon className="size-4" />
            </span>
            <CardTitle className="text-base">Luyện tập theo câu hỏi</CardTitle>
          </div>
          <CardDescription>
            Lọc, tìm kiếm và luyện từng câu hỏi riêng lẻ — trả lời xong là xem đáp án ngay, không giới hạn
            thời gian.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild variant="outline">
            <Link href={`/ky-nang/${meta.slug}/luyen-tap`}>Bắt đầu luyện tập</Link>
          </Button>
        </CardFooter>
      </Card>

      <div>
        <h2 className="font-heading text-lg font-medium tracking-tight">Đề thi thử</h2>
        <p className="text-sm text-muted-foreground">Làm bài theo đúng thời gian và cấu trúc đề thi thật.</p>
      </div>

      <ExamTestTable rows={rows} />
    </div>
  )
}
