"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter"
import { StartTestButton } from "@/components/dashboard/start-test-button"
import { ReviewTestDialog } from "@/components/tests/review-test-dialog"
import type { RealExamFlagSummary, Test } from "@/lib/data/types"

export interface ExamTestRow {
  test: Test
  inProgressAttemptId: string | null
  flagSummary: Record<string, RealExamFlagSummary>
}

export function ExamTestTable({ rows }: { rows: ExamTestRow[] }) {
  const router = useRouter()
  const [isStarting, setIsStarting] = React.useState(false)

  async function handleRowClick(row: ExamTestRow) {
    if (row.inProgressAttemptId) {
      router.push(`/bai-thi/${row.inProgressAttemptId}`)
      return
    }
    if (isStarting) return
    setIsStarting(true)
    try {
      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId: row.test.id }),
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error ?? "Không thể bắt đầu bài thi")
        return
      }
      router.push(`/bai-thi/${data.attemptId}`)
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setIsStarting(false)
    }
  }

  const columns = React.useMemo<ColumnDef<ExamTestRow, unknown>[]>(
    () => [
      {
        id: "title",
        accessorFn: (row) => row.test.title,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên đề" />,
        cell: ({ row }) => <span className="font-medium">{row.original.test.title}</span>,
      },
      {
        id: "duration",
        accessorFn: (row) => row.test.durationMinutes,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Thời lượng" />,
        cell: ({ row }) => <Badge variant="secondary">{row.original.test.durationMinutes} phút</Badge>,
      },
      {
        id: "description",
        accessorFn: (row) => row.test.description,
        header: "Mô tả",
        cell: ({ row }) => (
          <span className="block max-w-xs truncate text-muted-foreground">{row.original.test.description}</span>
        ),
        enableSorting: false,
      },
      {
        id: "status",
        accessorFn: (row) => (row.inProgressAttemptId ? "in-progress" : "not-started"),
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) =>
          row.original.inProgressAttemptId ? (
            <Badge variant="outline">Đang làm</Badge>
          ) : (
            <Badge variant="secondary">Chưa làm</Badge>
          ),
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Hành động</span>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2" onClick={(event) => event.stopPropagation()}>
            <ReviewTestDialog test={row.original.test} initialSummary={row.original.flagSummary} />
            {row.original.inProgressAttemptId ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/bai-thi/${row.original.inProgressAttemptId}`}>Tiếp tục</Link>
              </Button>
            ) : (
              <StartTestButton testId={row.original.test.id} size="sm" />
            )}
          </div>
        ),
        enableSorting: false,
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={rows}
      enableRowSelection
      onRowClick={handleRowClick}
      toolbar={(table) => (
        <DataTableFacetedFilter
          column={table.getColumn("status")}
          title="Trạng thái"
          options={[
            { label: "Đang làm", value: "in-progress" },
            { label: "Chưa làm", value: "not-started" },
          ]}
        />
      )}
    />
  )
}
