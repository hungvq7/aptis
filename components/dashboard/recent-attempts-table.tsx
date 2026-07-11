"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import type { ColumnDef } from "@tanstack/react-table"
import { FileTextIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { SKILL_META, type Attempt, type Result, type Test } from "@/lib/data/types"

const STATUS_LABEL: Record<Attempt["status"], string> = {
  "in-progress": "Đang làm",
  submitted: "Đã nộp",
  scored: "Đã chấm điểm",
}

const STATUS_VARIANT: Record<Attempt["status"], "secondary" | "outline" | "default"> = {
  "in-progress": "outline",
  submitted: "secondary",
  scored: "default",
}

interface AttemptRow {
  attempt: Attempt
  test: Test | undefined
  result: Result | undefined
}

function targetHref(attempt: Attempt): string {
  return attempt.status === "in-progress" ? `/bai-thi/${attempt.id}` : `/ket-qua/${attempt.id}`
}

export function RecentAttemptsTable({
  attempts,
  results,
  tests,
}: {
  attempts: Attempt[]
  results: Result[]
  tests: Test[]
}) {
  const router = useRouter()

  const rows = React.useMemo<AttemptRow[]>(() => {
    const resultByAttemptId = new Map(results.map((result) => [result.attemptId, result]))
    const testById = new Map(tests.map((test) => [test.id, test]))
    const sorted = [...attempts].sort((a, b) =>
      (b.submittedAt ?? b.startedAt).localeCompare(a.submittedAt ?? a.startedAt),
    )
    return sorted.map((attempt) => ({
      attempt,
      test: testById.get(attempt.testId),
      result: resultByAttemptId.get(attempt.id),
    }))
  }, [attempts, results, tests])

  const columns = React.useMemo<ColumnDef<AttemptRow, unknown>[]>(
    () => [
      {
        id: "skill",
        accessorFn: (row) => row.attempt.skill,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kỹ năng" />,
        cell: ({ row }) => <Badge variant="outline">{SKILL_META[row.original.attempt.skill].label}</Badge>,
      },
      {
        id: "test",
        accessorFn: (row) => row.test?.title ?? row.attempt.testId,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Đề luyện tập" />,
        cell: ({ row }) => (
          <span className="font-medium">{row.original.test?.title ?? row.original.attempt.testId}</span>
        ),
      },
      {
        id: "date",
        accessorFn: (row) => row.attempt.submittedAt ?? row.attempt.startedAt,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {format(new Date(row.original.attempt.submittedAt ?? row.original.attempt.startedAt), "dd/MM/yyyy")}
          </span>
        ),
      },
      {
        id: "status",
        accessorFn: (row) => row.attempt.status,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => (
          <Badge variant={STATUS_VARIANT[row.original.attempt.status]}>
            {STATUS_LABEL[row.original.attempt.status]}
          </Badge>
        ),
      },
      {
        id: "score",
        accessorFn: (row) => row.result?.scorePercent ?? -1,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Điểm" />,
        cell: ({ row }) => (row.original.result ? `${row.original.result.scorePercent}%` : "—"),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Hành động</span>,
        cell: ({ row }) => (
          <div className="flex justify-end" onClick={(event) => event.stopPropagation()}>
            <Button asChild size="sm" variant="outline">
              <Link href={targetHref(row.original.attempt)}>
                {row.original.attempt.status === "in-progress" ? "Tiếp tục" : "Xem kết quả"}
              </Link>
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [],
  )

  if (attempts.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileTextIcon />
          </EmptyMedia>
          <EmptyTitle>Chưa có bài luyện tập nào</EmptyTitle>
          <EmptyDescription>Chọn một kỹ năng để bắt đầu bài thi thử đầu tiên của bạn.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/ky-nang/nghe">Bắt đầu luyện tập</Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <DataTable
      columns={columns}
      data={rows}
      enableRowSelection
      onRowClick={(row) => router.push(targetHref(row.attempt))}
    />
  )
}
