"use client"

import * as React from "react"
import type { GapFillAnswer, GapFillQuestion } from "@/lib/data/types"

export function GapFillQuestionRenderer({
  question,
  answer,
  onChange,
}: {
  question: GapFillQuestion
  answer?: GapFillAnswer
  onChange: (answer: GapFillAnswer) => void
}) {
  const gapAnswers = answer?.gapAnswers ?? {}
  const gapById = new Map(question.gaps.map((gap) => [gap.id, gap]))

  function setGap(gapId: string, optionId: string) {
    onChange({
      questionId: question.id,
      type: "gap-fill",
      gapAnswers: { ...gapAnswers, [gapId]: optionId },
    })
  }

  const segments = React.useMemo(() => {
    const parts: Array<{ type: "text"; value: string } | { type: "gap"; gapId: string }> = []
    const regex = /\{\{(\w+)\}\}/g
    let lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = regex.exec(question.passageTemplate)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", value: question.passageTemplate.slice(lastIndex, match.index) })
      }
      parts.push({ type: "gap", gapId: match[1] })
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < question.passageTemplate.length) {
      parts.push({ type: "text", value: question.passageTemplate.slice(lastIndex) })
    }
    return parts
  }, [question.passageTemplate])

  return (
    <p className="text-pretty text-sm leading-8">
      {segments.map((segment, index) => {
        if (segment.type === "text") {
          return <span key={index}>{segment.value}</span>
        }
        const gap = gapById.get(segment.gapId)
        if (!gap) return null
        return (
          <select
            key={segment.gapId}
            value={gapAnswers[segment.gapId] ?? ""}
            onChange={(event) => setGap(segment.gapId, event.target.value)}
            className="mx-1 inline-block rounded border border-input bg-background px-1.5 py-0.5 align-middle text-sm"
          >
            <option value="" disabled>
              Chọn...
            </option>
            {gap.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        )
      })}
    </p>
  )
}
