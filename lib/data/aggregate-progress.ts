import { SKILL_META, type Attempt, type Result, type Skill } from "@/lib/data/types"

export interface SkillProgress {
  skill: Skill
  attemptCount: number
  bestScorePercent: number | null
  lastAttemptAt: string | null
}

export function computeSkillProgress(attempts: Attempt[], results: Result[]): SkillProgress[] {
  const resultByAttemptId = new Map(results.map((result) => [result.attemptId, result]))

  return (Object.keys(SKILL_META) as Skill[]).map((skill) => {
    const skillAttempts = attempts.filter((attempt) => attempt.skill === skill)
    const scoredPercents = skillAttempts
      .map((attempt) => resultByAttemptId.get(attempt.id)?.scorePercent)
      .filter((value): value is number => typeof value === "number")

    const lastAttemptAt = skillAttempts
      .map((attempt) => attempt.submittedAt ?? attempt.startedAt)
      .sort()
      .at(-1)

    return {
      skill,
      attemptCount: skillAttempts.length,
      bestScorePercent: scoredPercents.length > 0 ? Math.max(...scoredPercents) : null,
      lastAttemptAt: lastAttemptAt ?? null,
    }
  })
}
