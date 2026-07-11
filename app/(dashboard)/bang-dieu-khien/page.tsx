import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ProgressChartLoader } from "@/components/dashboard/progress-chart-loader"
import { RecentAttemptsTable } from "@/components/dashboard/recent-attempts-table"
import { WelcomeBanner } from "@/components/dashboard/welcome-banner"
import { LeaderboardCard } from "@/components/dashboard/leaderboard-card"
import { getCurrentUser } from "@/lib/session/current-user"
import { getTestRepository } from "@/lib/data/provider"
import { computeSkillProgress } from "@/lib/data/aggregate-progress"
import { computeStreak } from "@/lib/data/compute-streak"
import { computeBadges } from "@/lib/data/compute-badges"
import { SKILL_META, type Test } from "@/lib/data/types"

export const metadata: Metadata = {
  title: "Bảng điều khiển — Aptis Prep",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/dang-nhap")

  const repository = getTestRepository()
  const attempts = await repository.listAttemptsForUser(user.id)
  const results = await Promise.all(
    attempts
      .filter((attempt) => attempt.status === "scored")
      .map((attempt) => repository.getResult(attempt.id)),
  )
  const scoredResults = results.filter((result): result is NonNullable<typeof result> => result !== null)
  // Resolve via repository.getTest() (not the static ALL_TESTS list) so synthetic
  // tests (retry practice, mock-exam sessions) show a real title instead of a raw id.
  const uniqueTestIds = [...new Set(attempts.map((attempt) => attempt.testId))]
  const resolvedTests = await Promise.all(uniqueTestIds.map((testId) => repository.getTest(testId)))
  const tests = resolvedTests.filter((test): test is Test => test !== null)
  const progress = computeSkillProgress(attempts, scoredResults)
  const streak = computeStreak(attempts)
  const badges = computeBadges(attempts, scoredResults, streak)
  const leaderboard = await repository.getLeaderboard()

  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner userName={user.name} streak={streak} badges={badges} />

      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">Tổng quan</h1>
        <p className="text-sm text-muted-foreground">Theo dõi tiến bộ luyện thi của bạn theo từng kỹ năng.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {progress.map((item) => (
          <Card key={item.skill}>
            <CardHeader>
              <CardDescription>{SKILL_META[item.skill].label}</CardDescription>
              <CardTitle className="text-2xl">
                {item.bestScorePercent !== null ? `${item.bestScorePercent}%` : "—"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Progress value={item.bestScorePercent ?? 0} />
              <span className="text-xs text-muted-foreground">
                {item.attemptCount > 0 ? `${item.attemptCount} lượt luyện tập` : "Chưa luyện tập"}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">So sánh điểm số theo kỹ năng</CardTitle>
            <CardDescription>Điểm cao nhất đạt được trong các lượt làm bài đã chấm điểm.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressChartLoader progress={progress} />
          </CardContent>
        </Card>

        <LeaderboardCard entries={leaderboard} currentUserId={user.id} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lịch sử luyện tập gần đây</CardTitle>
          <CardDescription>Danh sách các bài thi thử bạn đã bắt đầu hoặc hoàn thành.</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentAttemptsTable attempts={attempts} results={scoredResults} tests={tests} />
        </CardContent>
      </Card>
    </div>
  )
}
