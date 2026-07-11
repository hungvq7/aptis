"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export interface ExamSessionRow {
  id: string
  startedAt: string
  status: "in-progress" | "completed"
  skillsCompleted: number
  currentAttemptId: string
}

function targetHref(row: ExamSessionRow): string {
  return row.status === "completed" ? `/thi-thu-tong-hop/${row.id}/ket-qua` : `/bai-thi/${row.currentAttemptId}`
}

export function ExamSessionTable({ rows }: { rows: ExamSessionRow[] }) {
  const router = useRouter()

  const columns = React.useMemo<ColumnDef<ExamSessionRow, unknown>[]>(
    () => [
      {
        id: "startedAt",
        accessorKey: "startedAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bắt đầu" />,
        cell: ({ row }) => (
          <span className="font-medium">{format(new Date(row.original.startedAt), "dd/MM/yyyy HH:mm")}</span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) =>
          row.original.status === "completed" ? (
            <Badge>Hoàn thành</Badge>
          ) : (
            <Badge variant="outline">Đang làm</Badge>
          ),
      },
      {
        id: "progress",
        accessorFn: (row) => row.skillsCompleted,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tiến độ" />,
        cell: ({ row }) => `${row.original.skillsCompleted}/4 kỹ năng`,
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Hành động</span>,
        cell: ({ row }) => (
          <div className="flex justify-end" onClick={(event) => event.stopPropagation()}>
            <Button asChild variant="outline" size="sm">
              <Link href={targetHref(row.original)}>
                {row.original.status === "completed" ? "Xem kết quả" : "Tiếp tục"}
              </Link>
            </Button>
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
      onRowClick={(row) => router.push(targetHref(row))}
    />
  )
}
