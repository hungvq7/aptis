"use client"

import * as React from "react"
import { GripVerticalIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ReorderAnswer, ReorderQuestion } from "@/lib/data/types"

export function ReorderQuestionRenderer({
  question,
  answer,
  onChange,
}: {
  question: ReorderQuestion
  answer?: ReorderAnswer
  onChange: (answer: ReorderAnswer) => void
}) {
  const order = answer?.order ?? []
  const itemById = new Map(question.items.map((item) => [item.id, item]))
  const pool = question.items.filter((item) => !order.includes(item.id))
  const [draggingId, setDraggingId] = React.useState<string | null>(null)

  function commit(next: string[]) {
    onChange({ questionId: question.id, type: "reorder", order: next })
  }

  function placeAt(itemId: string, targetIndex: number) {
    const withoutItem = order.filter((id) => id !== itemId)
    const next = [...withoutItem]
    next.splice(Math.min(targetIndex, withoutItem.length), 0, itemId)
    commit(next)
  }

  function unplace(itemId: string) {
    commit(order.filter((id) => id !== itemId))
  }

  function handleDropOnSlot(event: React.DragEvent, targetIndex: number) {
    event.preventDefault()
    const itemId = event.dataTransfer.getData("text/plain")
    if (itemId) placeAt(itemId, targetIndex)
    setDraggingId(null)
  }

  function handleDropOnPool(event: React.DragEvent) {
    event.preventDefault()
    const itemId = event.dataTransfer.getData("text/plain")
    if (itemId) unplace(itemId)
    setDraggingId(null)
  }

  return (
    <div className="flex flex-col gap-3">
      {question.instructions ? <p className="text-sm text-muted-foreground">{question.instructions}</p> : null}
      <p className="text-xs text-muted-foreground">
        Kéo thả câu từ danh sách bên phải vào đúng vị trí bên trái — hoặc bấm vào câu để thêm/bỏ.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-muted/30 p-3">
          <p className="text-xs font-medium text-muted-foreground">Thứ tự của bạn</p>
          {question.items.map((_, index) => {
            const itemId = order[index]
            const item = itemId ? itemById.get(itemId) : undefined
            return (
              <div
                key={index}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDropOnSlot(event, index)}
                className={cn(
                  "flex min-h-12 items-start gap-2 rounded-xl border border-dashed border-border/60 bg-card p-2.5 text-sm transition-colors",
                  item && "border-solid",
                  draggingId && !item && "border-primary/60 bg-primary/5",
                )}
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-medium text-secondary-foreground">
                  {index + 1}
                </span>
                {item ? (
                  <button
                    type="button"
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", item.id)
                      setDraggingId(item.id)
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    onClick={() => unplace(item.id)}
                    aria-label={`Bỏ "${item.label}" khỏi vị trí ${index + 1}`}
                    className="flex flex-1 cursor-grab items-start gap-2 text-left active:cursor-grabbing"
                  >
                    <GripVerticalIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    <span className="flex-1">{item.label}</span>
                    <XIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  </button>
                ) : (
                  <span className="flex-1 text-muted-foreground/60">Thả câu vào đây</span>
                )}
              </div>
            )
          })}
        </div>

        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDropOnPool}
          className={cn(
            "flex flex-col gap-2 rounded-2xl border border-border/60 p-3 transition-colors",
            draggingId && "border-primary/60 bg-primary/5",
          )}
        >
          <p className="text-xs font-medium text-muted-foreground">Các câu chưa sắp xếp</p>
          {pool.length === 0 ? (
            <p className="text-sm text-muted-foreground/60">Đã sắp xếp hết.</p>
          ) : (
            pool.map((item) => (
              <button
                key={item.id}
                type="button"
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData("text/plain", item.id)
                  setDraggingId(item.id)
                }}
                onDragEnd={() => setDraggingId(null)}
                onClick={() => placeAt(item.id, order.length)}
                aria-label={`Thêm "${item.label}" vào thứ tự`}
                className="flex cursor-grab items-start gap-2 rounded-xl border border-border/60 bg-card p-2.5 text-left text-sm active:cursor-grabbing"
              >
                <GripVerticalIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                <span className="flex-1">{item.label}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
