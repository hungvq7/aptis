"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import type { SkillProgress } from "@/lib/data/aggregate-progress"

// recharts' ResponsiveContainer measures the DOM to size the chart, which
// produces different markup on the server (no real container size yet) than
// on the client — a guaranteed hydration mismatch if SSR'd. Loading it via
// next/dynamic with ssr:false skips server rendering for this subtree
// entirely, so the server and the first client render both show the
// skeleton and only swap to the real chart after mount.
const ProgressChart = dynamic(
  () => import("@/components/dashboard/progress-chart").then((m) => m.ProgressChart),
  { ssr: false, loading: () => <Skeleton className="h-64 w-full" /> },
)

export function ProgressChartLoader({ progress }: { progress: SkillProgress[] }) {
  return <ProgressChart progress={progress} />
}
