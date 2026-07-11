import type { Answer, Question } from "@/lib/data/types"
import { countWords } from "@/lib/utils"

export interface QuestionScore {
  scoreRaw: number
  scoreMax: number
  needsReview: boolean
}

/**
 * Scores a single question against its answer. Objective question types
 * (multiple-choice/reorder/gap-fill/matching) are scored exactly.
 * Subjective types (short-answer/essay/speaking-prompt) get a stub
 * "completion" score based on word count / recording presence — real grading
 * needs human review or an AI scoring integration, tracked via needsReview.
 *
 * Pure content-comparison logic (only reads fields already embedded on the
 * Question/Answer objects) — safe to import from Server or Client Components,
 * not just from lib/data/mock/.
 */
export function scoreQuestion(question: Question, answer: Answer | undefined): QuestionScore {
  switch (question.type) {
    case "multiple-choice": {
      const correct =
        answer?.type === "multiple-choice" && answer.selectedOptionId === question.correctOptionId
      return { scoreRaw: correct ? 1 : 0, scoreMax: 1, needsReview: false }
    }
    case "reorder": {
      const correct =
        answer?.type === "reorder" &&
        answer.order.length === question.correctOrder.length &&
        answer.order.every((id, index) => id === question.correctOrder[index])
      return { scoreRaw: correct ? 1 : 0, scoreMax: 1, needsReview: false }
    }
    case "gap-fill": {
      const scoreMax = question.gaps.length
      if (answer?.type !== "gap-fill") return { scoreRaw: 0, scoreMax, needsReview: false }
      const scoreRaw = question.gaps.reduce(
        (sum, gap) => sum + (answer.gapAnswers[gap.id] === gap.correctOptionId ? 1 : 0),
        0,
      )
      return { scoreRaw, scoreMax, needsReview: false }
    }
    case "matching": {
      const scoreMax = question.prompts.length
      if (answer?.type !== "matching") return { scoreRaw: 0, scoreMax, needsReview: false }
      const scoreRaw = question.prompts.reduce(
        (sum, prompt) =>
          sum + (answer.matchAnswers[prompt.id] === question.correctMap[prompt.id] ? 1 : 0),
        0,
      )
      return { scoreRaw, scoreMax, needsReview: false }
    }
    case "short-answer":
    case "essay": {
      const text = answer?.type === question.type ? answer.text : ""
      const wordCount = countWords(text)
      const complete = wordCount >= question.minWords && wordCount <= question.maxWords
      // TODO: real scoring requires human review or an AI/ERPNext-side scoring
      // integration. This is a completion stub, not a language-quality score.
      return { scoreRaw: complete ? 1 : wordCount > 0 ? 0.5 : 0, scoreMax: 1, needsReview: true }
    }
    case "speaking-prompt": {
      const hasRecording = answer?.type === "speaking-prompt" && answer.hasRecording
      // TODO: real scoring requires human review or an AI/ERPNext-side scoring
      // integration. This is a completion stub, not a pronunciation/fluency score.
      return { scoreRaw: hasRecording ? 1 : 0, scoreMax: 1, needsReview: true }
    }
  }
}
