"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter"

export interface ExamReportRow {
  id: string
  examDate: string
  testCenter: string
  totalQuestions: number
  submittedAt: string
}

export function ExamReportTable({ rows }: { rows: ExamReportRow[] }) {
  const router = useRouter()
  const testCenters = React.useMemo(() => Array.from(new Set(rows.map((row) => row.testCenter))), [rows])

  const columns = React.useMemo<ColumnDef<ExamReportRow, unknown>[]>(
    () => [
      {
        id: "examDate",
        accessorKey: "examDate",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày thi" />,
        cell: ({ row }) => <span className="font-medium">{row.original.examDate}</span>,
      },
      {
        id: "testCenter",
        accessorKey: "testCenter",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Cơ sở thi" />,
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
      },
      {
        id: "totalQuestions",
        accessorKey: "totalQuestions",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số câu ghi nhận" />,
        cell: ({ row }) => `${row.original.totalQuestions} câu`,
      },
      {
        id: "submittedAt",
        accessorKey: "submittedAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày gửi" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {new Date(row.original.submittedAt).toLocaleDateString("vi-VN")}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Hành động</span>,
        cell: ({ row }) => (
          <div className="flex justify-end" onClick={(event) => event.stopPropagation()}>
            <Button asChild variant="outline" size="sm">
              <Link href={`/review-de/${row.original.id}`}>Xem</Link>
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
      onRowClick={(row) => router.push(`/review-de/${row.id}`)}
      toolbar={(table) => (
        <DataTableFacetedFilter
          column={table.getColumn("testCenter")}
          title="Cơ sở thi"
          options={testCenters.map((center) => ({ label: center, value: center }))}
        />
      )}
    />
  )
}
