"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MatchingAnswer, MatchingQuestion } from "@/lib/data/types"

export function MatchingQuestionRenderer({
  question,
  answer,
  onChange,
}: {
  question: MatchingQuestion
  answer?: MatchingAnswer
  onChange: (answer: MatchingAnswer) => void
}) {
  const matchAnswers = answer?.matchAnswers ?? {}

  function setMatch(promptId: string, optionId: string) {
    onChange({
      questionId: question.id,
      type: "matching",
      matchAnswers: { ...matchAnswers, [promptId]: optionId },
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {question.prompts.map((prompt) => (
        <div
          key={prompt.id}
          className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm">{prompt.label}</p>
          <Select value={matchAnswers[prompt.id] ?? undefined} onValueChange={(value) => setMatch(prompt.id, value)}>
            <SelectTrigger size="sm" className="w-full sm:w-56">
              <SelectValue placeholder="Chọn đáp án..." />
            </SelectTrigger>
            <SelectContent>
              {question.options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  )
}
