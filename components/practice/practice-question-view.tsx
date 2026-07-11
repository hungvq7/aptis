"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { PassageSplitView } from "@/components/test-runner/passage-split-view"
import { RenderQuestion } from "@/components/test-runner/render-question"
import { AnswerReveal } from "@/components/practice/answer-reveal"
import { QUESTION_TYPE_LABELS } from "@/lib/data/aggregate-question-type-stats"
import type { Answer, QuestionBankEntry } from "@/lib/data/types"

export function PracticeQuestionView({ entry }: { entry: QuestionBankEntry }) {
  const [answer, setAnswer] = React.useState<Answer | undefined>(undefined)
  const part = React.useMemo(() => ({ id: entry.partId, title: entry.partTitle }), [entry.partId, entry.partTitle])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline">{QUESTION_TYPE_LABELS[entry.question.type]}</Badge>
        <span className="text-sm text-muted-foreground">{entry.partTitle}</span>
      </div>

      {entry.passages && entry.passages.length > 0 ? (
        <PassageSplitView passages={entry.passages}>
          <div className="flex flex-col gap-4">
            <RenderQuestion question={entry.question} answer={answer} onChange={setAnswer} />
            {answer ? <AnswerReveal question={entry.question} part={part} answer={answer} /> : null}
          </div>
        </PassageSplitView>
      ) : (
        <>
          <RenderQuestion question={entry.question} answer={answer} onChange={setAnswer} />
          {answer ? <AnswerReveal question={entry.question} part={part} answer={answer} /> : null}
        </>
      )}
    </div>
  )
}
