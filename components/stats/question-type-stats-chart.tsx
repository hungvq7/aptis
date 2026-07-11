"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import type { QuestionTypeStat } from "@/lib/data/types"

const chartConfig = {
  accuracyPercent: {
    label: "Độ chính xác (%)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function QuestionTypeStatsChart({ stats }: { stats: QuestionTypeStat[] }) {
  const data = stats
    .filter((stat) => !stat.isCompletionOnly && stat.total > 0)
    .map((stat) => ({ label: stat.label, accuracyPercent: stat.accuracyPercent ?? 0 }))

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">Chưa có đủ dữ liệu để hiển thị biểu đồ.</p>
  }

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <BarChart data={data} margin={{ left: -20 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={32} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="accuracyPercent" fill="var(--color-accuracyPercent)" radius={8} />
      </BarChart>
    </ChartContainer>
  )
}
