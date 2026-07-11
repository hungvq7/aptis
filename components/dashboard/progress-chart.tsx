"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { SKILL_META } from "@/lib/data/types"
import type { SkillProgress } from "@/lib/data/aggregate-progress"

const chartConfig = {
  bestScorePercent: {
    label: "Điểm cao nhất (%)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ProgressChart({ progress }: { progress: SkillProgress[] }) {
  const data = progress.map((item) => ({
    skill: SKILL_META[item.skill].label,
    bestScorePercent: item.bestScorePercent ?? 0,
  }))

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <BarChart data={data} margin={{ left: -20 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="skill" tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={32} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="bestScorePercent" fill="var(--color-bestScorePercent)" radius={8} />
      </BarChart>
    </ChartContainer>
  )
}
