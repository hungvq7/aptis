import type { Answer, Part, Question } from "@/lib/data/types"
import { scoreQuestion, type QuestionScore } from "@/lib/data/question-scoring"

/** Only `id`/`title` are actually needed — lets callers pass either a full Part
 * or a lightweight `{id, title}` (e.g. from a flattened QuestionBankEntry). */
export type PartRef = Pick<Part, "id" | "title">

export interface EvaluatedQuestion {
  question: Question
  part: PartRef
  answer: Answer | undefined
  score: QuestionScore
  isCorrect: boolean
  yourAnswerSummary: string
  correctAnswerSummary: string
}

/**
 * Scores one question against one answer and formats human-readable
 * summaries of both. Pure/no I/O — safe to call from Server or Client
 * Components (e.g. the exam-attempt review page, or the untimed practice
 * mode's instant "show answer" feature).
 */
export function evaluateQuestion(question: Question, part: PartRef, answer: Answer | undefined): EvaluatedQuestion {
  const score = scoreQuestion(question, answer)
  const isCorrect = !score.needsReview && score.scoreMax > 0 && score.scoreRaw === score.scoreMax
  return {
    question,
    part,
    answer,
    score,
    isCorrect,
    yourAnswerSummary: summarizeAnswer(question, answer),
    correctAnswerSummary: summarizeCorrectAnswer(question),
  }
}

function optionLabel(options: { id: string; label: string }[], optionId: string | null | undefined): string {
  if (!optionId) return "Chưa trả lời"
  return options.find((option) => option.id === optionId)?.label ?? "Chưa trả lời"
}

export function summarizeAnswer(question: Question, answer: Answer | undefined): string {
  switch (question.type) {
    case "multiple-choice": {
      const selected = answer?.type === "multiple-choice" ? answer.selectedOptionId : null
      return optionLabel(question.options, selected)
    }
    case "reorder": {
      if (answer?.type !== "reorder" || answer.order.length === 0) return "Chưa trả lời"
      const itemById = new Map(question.items.map((item) => [item.id, item.label]))
      return answer.order.map((id, index) => `${index + 1}) ${itemById.get(id) ?? id}`).join(" ")
    }
    case "gap-fill": {
      if (answer?.type !== "gap-fill") return "Chưa trả lời"
      return question.gaps
        .map((gap) => `${gap.id}: ${optionLabel(gap.options, answer.gapAnswers[gap.id])}`)
        .join("; ")
    }
    case "matching": {
      if (answer?.type !== "matching") return "Chưa trả lời"
      return question.prompts
        .map((prompt) => `${prompt.label} → ${optionLabel(question.options, answer.matchAnswers[prompt.id])}`)
        .join("; ")
    }
    case "short-answer":
    case "essay":
      return answer?.type === question.type && answer.text.trim() ? answer.text : "Chưa trả lời"
    case "speaking-prompt":
      return answer?.type === "speaking-prompt" && answer.hasRecording ? "Đã ghi âm" : "Chưa ghi âm"
  }
}

export function summarizeCorrectAnswer(question: Question): string {
  switch (question.type) {
    case "multiple-choice":
      return optionLabel(question.options, question.correctOptionId)
    case "reorder": {
      const itemById = new Map(question.items.map((item) => [item.id, item.label]))
      return question.correctOrder.map((id, index) => `${index + 1}) ${itemById.get(id) ?? id}`).join(" ")
    }
    case "gap-fill":
      return question.gaps
        .map((gap) => `${gap.id}: ${optionLabel(gap.options, gap.correctOptionId)}`)
        .join("; ")
    case "matching":
      return question.prompts
        .map((prompt) => `${prompt.label} → ${optionLabel(question.options, question.correctMap[prompt.id])}`)
        .join("; ")
    case "short-answer":
    case "essay":
    case "speaking-prompt":
      return "—"
  }
}

/** MC/short-answer/essay/speaking-prompt carry their own `.prompt`; the rest fall back to context. */
export function promptTextFor(question: Question, part: PartRef): string {
  switch (question.type) {
    case "multiple-choice":
    case "short-answer":
    case "essay":
    case "speaking-prompt":
      return question.prompt
    case "reorder":
      return question.instructions ?? part.title
    case "gap-fill":
    case "matching":
      return part.title
  }
}
