"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import type { QuestionTypeStat } from "@/lib/data/types"

// Same ssr:false rationale as components/dashboard/progress-chart-loader.tsx —
// recharts' ResponsiveContainer causes a real hydration mismatch if SSR'd.
const QuestionTypeStatsChart = dynamic(
  () => import("@/components/stats/question-type-stats-chart").then((m) => m.QuestionTypeStatsChart),
  { ssr: false, loading: () => <Skeleton className="h-64 w-full" /> },
)

export function QuestionTypeStatsChartLoader({ stats }: { stats: QuestionTypeStat[] }) {
  return <QuestionTypeStatsChart stats={stats} />
}
