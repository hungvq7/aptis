"use client"

import * as React from "react"
import { toast } from "sonner"
import { ListChecksIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { promptTextFor } from "@/lib/data/question-content"
import type { RealExamFlagSummary, Test } from "@/lib/data/types"

export function ReviewTestDialog({
  test,
  initialSummary,
}: {
  test: Test
  initialSummary: Record<string, RealExamFlagSummary>
}) {
  const [summary, setSummary] = React.useState(initialSummary)

  async function handleToggle(questionId: string) {
    const previous = summary[questionId] ?? { count: 0, flaggedByMe: false }
    const optimistic: RealExamFlagSummary = previous.flaggedByMe
      ? { count: Math.max(0, previous.count - 1), flaggedByMe: false }
      : { count: previous.count + 1, flaggedByMe: true }
    setSummary((prev) => ({ ...prev, [questionId]: optimistic }))

    try {
      const response = await fetch(`/api/questions/${questionId}/exam-flag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId: test.id }),
      })
      if (!response.ok) throw new Error("toggle failed")
      const data: RealExamFlagSummary = await response.json()
      setSummary((prev) => ({ ...prev, [questionId]: data }))
    } catch {
      setSummary((prev) => ({ ...prev, [questionId]: previous }))
      toast.error("Không thể lưu xác nhận, vui lòng kiểm tra kết nối mạng")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <ListChecksIcon />
          Đánh dấu câu đã ra thi
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Đánh dấu câu đã ra thi — {test.title}</DialogTitle>
          <DialogDescription>
            Tick vào các câu bạn nhớ đã xuất hiện trong đề thi thật, để những người luyện tập khác cũng biết.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          {test.parts.map((part) => (
            <div key={part.id} className="flex flex-col gap-3">
              <h3 className="text-sm font-medium">{part.title}</h3>
              <div className="flex flex-col gap-2">
                {part.questions.map((question) => {
                  const flag = summary[question.id] ?? { count: 0, flaggedByMe: false }
                  return (
                    <div
                      key={question.id}
                      className="flex items-start gap-2 rounded-2xl border border-border/60 p-3 text-sm"
                    >
                      <Checkbox
                        checked={flag.flaggedByMe}
                        onCheckedChange={() => handleToggle(question.id)}
                        className="mt-0.5"
                        aria-label="Đã ra trong đề thi thật"
                      />
                      <span className="flex-1 text-pretty">{promptTextFor(question, part)}</span>
                      {flag.count > 0 ? (
                        <span className="shrink-0 text-xs text-muted-foreground">{flag.count} xác nhận</span>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
