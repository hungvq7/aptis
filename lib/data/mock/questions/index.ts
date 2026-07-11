import type { Skill, Test } from "@/lib/data/types"
import { readingTest1 } from "@/lib/data/mock/questions/reading-test-1"
import { listeningTest1 } from "@/lib/data/mock/questions/listening-test-1"
import { writingTest1 } from "@/lib/data/mock/questions/writing-test-1"
import { speakingTest1 } from "@/lib/data/mock/questions/speaking-test-1"

// Add more tests by authoring a new file next to these (copy an existing one
// as a template) and appending it to the relevant skill's array below.
export const TESTS_BY_SKILL: Record<Skill, Test[]> = {
  reading: [readingTest1],
  listening: [listeningTest1],
  writing: [writingTest1],
  speaking: [speakingTest1],
}

export const ALL_TESTS: Test[] = Object.values(TESTS_BY_SKILL).flat()
