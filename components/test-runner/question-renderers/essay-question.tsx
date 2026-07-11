"use client"

import { RichTextEditable } from "@/components/test-runner/rich-text-editable"
import { cn, countWords } from "@/lib/utils"
import type { EssayAnswer, EssayQuestion } from "@/lib/data/types"

export function EssayQuestionRenderer({
  question,
  answer,
  onChange,
}: {
  question: EssayQuestion
  answer?: EssayAnswer
  onChange: (answer: EssayAnswer) => void
}) {
  const text = answer?.text ?? ""
  const wordCount = countWords(text)
  const outOfRange = text.length > 0 && (wordCount < question.minWords || wordCount > question.maxWords)

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-pretty">{question.prompt}</p>
      <RichTextEditable
        key={question.id}
        initialValue={text}
        onChange={(value) => onChange({ questionId: question.id, type: "essay", text: value })}
        placeholder="Viết bài của bạn ở đây..."
        minHeightClassName="min-h-40"
        maxWords={question.maxWords}
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className={cn(outOfRange && "text-destructive")}>
          {wordCount} từ (yêu cầu {question.minWords}–{question.maxWords} từ)
        </span>
        {question.timeLimitMinutes ? <span>Gợi ý thời gian: {question.timeLimitMinutes} phút</span> : null}
      </div>
    </div>
  )
}
