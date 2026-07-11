import { TrophyIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { cn } from "@/lib/utils"
import type { LeaderboardEntry } from "@/lib/data/types"

const RANK_MEDAL_COLORS: Record<number, string> = {
  1: "bg-amber-400 text-amber-950",
  2: "bg-slate-300 text-slate-800",
  3: "bg-orange-400 text-orange-950",
}

export function LeaderboardCard({
  entries,
  currentUserId,
}: {
  entries: LeaderboardEntry[]
  currentUserId: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Bảng xếp hạng</CardTitle>
        <CardDescription>Điểm trung bình các bài thi thử đã chấm điểm.</CardDescription>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TrophyIcon />
              </EmptyMedia>
              <EmptyTitle>Chưa có ai hoàn thành bài thi thử</EmptyTitle>
              <EmptyDescription>Hoàn thành một bài thi thử để xuất hiện trên bảng xếp hạng.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ol className="flex flex-col gap-2">
            {entries.map((entry) => (
              <li
                key={entry.userId}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2",
                  entry.userId === currentUserId && "bg-primary/5 ring-1 ring-primary/20",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                    RANK_MEDAL_COLORS[entry.rank] ?? "bg-muted text-muted-foreground",
                  )}
                >
                  {entry.rank}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {entry.name}
                    {entry.userId === currentUserId ? (
                      <span className="ml-1.5 text-xs font-normal text-muted-foreground">(bạn)</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-muted-foreground">{entry.scoredAttemptCount} bài đã chấm điểm</p>
                </div>
                <span className="font-heading text-lg font-medium">{entry.avgScorePercent}%</span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
