import type { QuestionType, QuestionTypeStat } from "@/lib/data/types"

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  "multiple-choice": "Trắc nghiệm",
  reorder: "Sắp xếp câu",
  "gap-fill": "Điền khuyết",
  matching: "Ghép nối",
  "short-answer": "Trả lời ngắn",
  essay: "Bài luận",
  "speaking-prompt": "Nói",
}

const COMPLETION_ONLY_TYPES = new Set<QuestionType>(["short-answer", "essay", "speaking-prompt"])

/**
 * Pure formatting layer over raw correct/total tallies — no scoring logic
 * lives here (that's in lib/data/question-scoring.ts). Always emits all 7
 * question types (zero-total ones included) so the function is
 * predictable/testable; callers decide whether to hide zero-total rows.
 */
export function computeQuestionTypeStats(
  tallies: Record<string, { correct: number; total: number }>,
): QuestionTypeStat[] {
  const types = Object.keys(QUESTION_TYPE_LABELS) as QuestionType[]

  const stats = types.map((questionType) => {
    const tally = tallies[questionType] ?? { correct: 0, total: 0 }
    return {
      questionType,
      label: QUESTION_TYPE_LABELS[questionType],
      correct: tally.correct,
      total: tally.total,
      accuracyPercent: tally.total > 0 ? Math.round((tally.correct / tally.total) * 100) : null,
      isCompletionOnly: COMPLETION_ONLY_TYPES.has(questionType),
    }
  })

  return stats.sort((a, b) => {
    if (a.accuracyPercent === null) return 1
    if (b.accuracyPercent === null) return -1
    return a.accuracyPercent - b.accuracyPercent
  })
}
