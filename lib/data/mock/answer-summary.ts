import type { Attempt, Test } from "@/lib/data/types"
import { evaluateQuestion, type EvaluatedQuestion } from "@/lib/data/question-content"

export type { EvaluatedQuestion }

/**
 * Pairs every question in a Test with the Attempt's saved answer and scores
 * it. Shared by the "review your answers" feature and the "retry incorrect
 * questions" feature so both agree on exactly which questions were wrong.
 */
export function evaluateAttemptQuestions(test: Test, attempt: Attempt): EvaluatedQuestion[] {
  const answerByQuestionId = new Map(attempt.answers.map((answer) => [answer.questionId, answer]))

  return test.parts.flatMap((part) =>
    part.questions.map((question) => evaluateQuestion(question, part, answerByQuestionId.get(question.id))),
  )
}
