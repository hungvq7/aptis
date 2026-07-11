"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  ListChecksIcon,
  LightbulbIcon,
  PuzzleIcon,
  SearchIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FloatingBlobs } from "@/components/decor/floating-blobs"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { DataTable } from "@/components/ui/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter"
import { PracticeQuestionView } from "@/components/practice/practice-question-view"
import { QUESTION_TYPE_LABELS } from "@/lib/data/aggregate-question-type-stats"
import { promptTextFor } from "@/lib/data/question-content"
import type { QuestionBankEntry, RealExamFlagSummary } from "@/lib/data/types"

const PART_GRADIENTS = [
  "from-blue-400 via-blue-500 to-indigo-600",
  "from-cyan-400 via-sky-500 to-blue-600",
  "from-amber-300 via-orange-400 to-amber-500",
  "from-emerald-400 via-green-500 to-teal-600",
  "from-violet-400 via-purple-500 to-fuchsia-600",
]
const PART_ICONS = [BookOpenIcon, PuzzleIcon, ClipboardCheckIcon, LightbulbIcon]

export function PracticeBrowser({
  entries,
  flagSummary = {},
}: {
  entries: QuestionBankEntry[]
  flagSummary?: Record<string, RealExamFlagSummary>
}) {
  const [selectedPartId, setSelectedPartId] = React.useState<string | null>(null)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const availableParts = React.useMemo(() => {
    const seen = new Map<string, { title: string; count: number }>()
    for (const entry of entries) {
      const existing = seen.get(entry.partId)
      if (existing) existing.count += 1
      else seen.set(entry.partId, { title: entry.partTitle, count: 1 })
    }
    return Array.from(seen.entries()).map(([partId, { title, count }]) => ({ partId, title, count }))
  }, [entries])

  const partEntries = React.useMemo(
    () => entries.filter((entry) => entry.partId === selectedPartId),
    [entries, selectedPartId],
  )
  const availableTypes = React.useMemo(
    () => Array.from(new Set(partEntries.map((entry) => entry.question.type))),
    [partEntries],
  )

  const columns = React.useMemo<ColumnDef<QuestionBankEntry, unknown>[]>(
    () => [
      {
        id: "type",
        accessorFn: (entry) => entry.question.type,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Dạng câu hỏi" />,
        cell: ({ row }) => <Badge variant="outline">{QUESTION_TYPE_LABELS[row.original.question.type]}</Badge>,
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
      },
      {
        id: "content",
        accessorFn: (entry) => promptTextFor(entry.question, { id: entry.partId, title: entry.partTitle }),
        header: "Nội dung câu hỏi",
        cell: ({ getValue }) => <span className="line-clamp-1 text-pretty">{getValue() as string}</span>,
        enableSorting: false,
      },
      {
        id: "examFlag",
        header: "Đã ra thi thật",
        cell: ({ row }) => {
          const flag = flagSummary[row.original.question.id]
          return flag && flag.count > 0 ? (
            <Badge variant="secondary">
              <ListChecksIcon />
              {flag.count} xác nhận
            </Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          )
        },
        enableSorting: false,
      },
    ],
    [flagSummary],
  )

  if (!selectedPartId) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {availableParts.map(({ partId, title, count }, index) => {
          const Icon = PART_ICONS[index % PART_ICONS.length]
          return (
            <button
              key={partId}
              type="button"
              onClick={() => setSelectedPartId(partId)}
              className="group aspect-square overflow-hidden rounded-3xl shadow-md ring-1 ring-foreground/5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br p-4 text-white ${PART_GRADIENTS[index % PART_GRADIENTS.length]}`}
              >
                <FloatingBlobs />

                <span className="relative z-10 flex size-14 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-lg transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon className="size-7" />
                </span>
                <div className="relative z-10 text-center">
                  <p className="font-heading text-sm font-semibold drop-shadow-sm">{title}</p>
                  <p className="text-xs text-white/85">{count} câu hỏi</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  const currentPartTitle = availableParts.find((part) => part.partId === selectedPartId)?.title ?? ""

  if (selectedId) {
    const currentIndex = partEntries.findIndex((entry) => entry.question.id === selectedId)
    const entry = partEntries[currentIndex]
    if (entry) {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedId(null)}>
              <ChevronLeftIcon />
              Quay lại danh sách
            </Button>
            <span className="text-sm text-muted-foreground">
              Câu {currentIndex + 1} / {partEntries.length}
            </span>
          </div>

          <PracticeQuestionView key={entry.question.id} entry={entry} />

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={currentIndex === 0}
              onClick={() => setSelectedId(partEntries[currentIndex - 1].question.id)}
            >
              <ChevronLeftIcon />
              Câu trước
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={currentIndex === partEntries.length - 1}
              onClick={() => setSelectedId(partEntries[currentIndex + 1].question.id)}
            >
              Câu tiếp theo
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedPartId(null)
            setSelectedId(null)
          }}
        >
          <ChevronLeftIcon />
          Chọn phần khác
        </Button>
        <span className="text-sm font-medium">{currentPartTitle}</span>
      </div>
      <DataTable
        columns={columns}
        data={partEntries}
        enableRowSelection
        onRowClick={(entry) => setSelectedId(entry.question.id)}
        toolbar={(table) => (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <InputGroup className="sm:max-w-xs">
              <InputGroupInput
                placeholder="Tìm kiếm câu hỏi..."
                value={(table.getState().globalFilter as string) ?? ""}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>
                  <SearchIcon />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <DataTableFacetedFilter
              column={table.getColumn("type")}
              title="Dạng câu hỏi"
              options={availableTypes.map((type) => ({ label: QUESTION_TYPE_LABELS[type], value: type }))}
            />
          </div>
        )}
      />
    </div>
  )
}
