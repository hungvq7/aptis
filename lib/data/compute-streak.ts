import { differenceInCalendarDays, format, parseISO, subDays } from "date-fns"
import type { Attempt, StreakInfo } from "@/lib/data/types"

/** Consecutive-day practice streak, computed from attempt activity dates (server-local time). */
export function computeStreak(attempts: Attempt[], now: Date = new Date()): StreakInfo {
  const dayKeys = new Set(
    attempts.map((attempt) => format(parseISO(attempt.submittedAt ?? attempt.startedAt), "yyyy-MM-dd")),
  )

  let currentStreak = 0
  let cursor = now
  while (dayKeys.has(format(cursor, "yyyy-MM-dd"))) {
    currentStreak += 1
    cursor = subDays(cursor, 1)
  }

  const sortedDays = Array.from(dayKeys).sort()
  let longestStreak = 0
  let runLength = 0
  for (let i = 0; i < sortedDays.length; i += 1) {
    if (i === 0 || differenceInCalendarDays(parseISO(sortedDays[i]), parseISO(sortedDays[i - 1])) === 1) {
      runLength += 1
    } else {
      runLength = 1
    }
    longestStreak = Math.max(longestStreak, runLength)
  }

  return {
    currentStreak,
    longestStreak,
    practicedToday: dayKeys.has(format(now, "yyyy-MM-dd")),
  }
}
