import type { Answer, Part } from "@/lib/data/types"

/** Every question in the part has a saved answer. */
export function isPartComplete(part: Part, answers: Record<string, Answer>): boolean {
  return part.questions.every((question) => answers[question.id] !== undefined)
}

/** At least one question in the part has a saved answer. */
export function isPartAnyAnswered(part: Part, answers: Record<string, Answer>): boolean {
  return part.questions.some((question) => answers[question.id] !== undefined)
}
