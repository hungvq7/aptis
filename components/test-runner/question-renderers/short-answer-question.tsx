"use client"

import { RichTextEditable } from "@/components/test-runner/rich-text-editable"
import { cn, countWords } from "@/lib/utils"
import type { ShortAnswerAnswer, ShortAnswerQuestion } from "@/lib/data/types"

export function ShortAnswerQuestionRenderer({
  question,
  answer,
  onChange,
}: {
  question: ShortAnswerQuestion
  answer?: ShortAnswerAnswer
  onChange: (answer: ShortAnswerAnswer) => void
}) {
  const text = answer?.text ?? ""
  const wordCount = countWords(text)
  const outOfRange = text.length > 0 && (wordCount < question.minWords || wordCount > question.maxWords)

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">{question.prompt}</p>
      <RichTextEditable
        key={question.id}
        initialValue={text}
        onChange={(value) => onChange({ questionId: question.id, type: "short-answer", text: value })}
        placeholder="Nhập câu trả lời của bạn..."
        minHeightClassName="min-h-16"
        maxWords={question.maxWords}
      />
      <span className={cn("text-xs text-muted-foreground", outOfRange && "text-destructive")}>
        {wordCount} từ (yêu cầu {question.minWords}–{question.maxWords} từ)
      </span>
    </div>
  )
}
