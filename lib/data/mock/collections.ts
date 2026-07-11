import {
  attemptSchema,
  examReportSchema,
  examSessionSchema,
  realExamFlagSchema,
  resultSchema,
  testSchema,
  userSchema,
  type Attempt,
  type ExamReport,
  type ExamSession,
  type RealExamFlag,
  type Result,
  type Test,
  type User,
} from "@/lib/data/types"
import { createJsonCollection } from "@/lib/data/mock/store"

export const usersCollection = createJsonCollection<User>(
  "users.json",
  userSchema,
  (user) => user.id,
)

export const attemptsCollection = createJsonCollection<Attempt>(
  "attempts.json",
  attemptSchema,
  (attempt) => attempt.id,
)

export const resultsCollection = createJsonCollection<Result>(
  "results.json",
  resultSchema,
  (result) => result.attemptId,
)

/** Synthetic "retry your wrong questions" tests, generated on demand — see MockTestRepository.createRetryAttempt. */
export const syntheticTestsCollection = createJsonCollection<Test>(
  "synthetic-tests.json",
  testSchema,
  (test) => test.id,
)

/** Crowd-sourced "this question appeared on a real exam" confirmations — see MockTestRepository.toggleRealExamFlag. */
export const realExamFlagsCollection = createJsonCollection<RealExamFlag>(
  "real-exam-flags.json",
  realExamFlagSchema,
  (flag) => flag.id,
)

/** User-submitted "Review đề" recollections of a real exam sitting (date + test center + compiled questions). */
export const examReportsCollection = createJsonCollection<ExamReport>(
  "exam-reports.json",
  examReportSchema,
  (report) => report.id,
)

/** Combined mock-exam sessions chaining all 4 skills — see MockTestRepository.createExamSession/advanceExamSession. */
export const examSessionsCollection = createJsonCollection<ExamSession>(
  "exam-sessions.json",
  examSessionSchema,
  (session) => session.id,
)
