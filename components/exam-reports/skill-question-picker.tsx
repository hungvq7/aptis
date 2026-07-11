"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { promptTextFor } from "@/lib/data/question-content"
import type { QuestionBankEntry } from "@/lib/data/types"

export function SkillQuestionPicker({
  entries,
  selected,
  onToggle,
}: {
  entries: QuestionBankEntry[]
  selected: Set<string>
  onToggle: (questionId: string) => void
}) {
  const [search, setSearch] = React.useState("")

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return entries
    return entries.filter((entry) =>
      promptTextFor(entry.question, { id: entry.partId, title: entry.partTitle }).toLowerCase().includes(query),
    )
  }, [entries, search])

  return (
    <div className="flex flex-col gap-3">
      <InputGroup>
        <InputGroupInput
          placeholder="Tìm câu hỏi trong phần này..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText>
            <SearchIcon />
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Không tìm thấy câu hỏi phù hợp.</p>
        ) : (
          filtered.map((entry) => (
            <div
              key={entry.question.id}
              className="flex items-start gap-2 rounded-2xl border border-border/60 p-3 text-sm"
            >
              <Checkbox
                checked={selected.has(entry.question.id)}
                onCheckedChange={() => onToggle(entry.question.id)}
                className="mt-0.5"
                aria-label="Đã xuất hiện trong đề thi"
              />
              <div className="flex-1">
                <p className="text-pretty">
                  {promptTextFor(entry.question, { id: entry.partId, title: entry.partTitle })}
                </p>
                <p className="text-xs text-muted-foreground">{entry.partTitle}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
