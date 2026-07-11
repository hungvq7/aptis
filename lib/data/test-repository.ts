import type {
  Answer,
  Attempt,
  ExamReport,
  ExamReportDetail,
  ExamSession,
  ExamSessionSummary,
  LeaderboardEntry,
  QuestionBankEntry,
  QuestionReviewItem,
  QuestionTypeStat,
  RealExamFlagSummary,
  Result,
  Skill,
  Test,
} from "@/lib/data/types"

// Single seam for all test/attempt data access. Today resolved to
// MockTestRepository (JSON-file backed) via lib/data/provider.ts. Swapping to
// ERPNext later means writing an ErpnextTestRepository implementing this same
// interface (e.g. backed by /api/resource/<DocType> calls) and flipping the
// factory in provider.ts — no UI or route handler changes required. This
// includes the coach-feature methods below (bookmarks/review/retry/stats) —
// nothing in app/** or components/** should reach around this interface.
export interface TestRepository {
  listTests(skill?: Skill): Promise<Test[]>
  getTest(testId: string): Promise<Test | null>
  createAttempt(userId: string, testId: string, examSessionId?: string): Promise<Attempt>
  getAttempt(attemptId: string): Promise<Attempt | null>
  saveAnswer(attemptId: string, answer: Answer): Promise<void>
  submitAttempt(attemptId: string): Promise<Result>
  listAttemptsForUser(userId: string, skill?: Skill): Promise<Attempt[]>
  getResult(attemptId: string): Promise<Result | null>
  setBookmark(attemptId: string, questionId: string, bookmarked: boolean): Promise<void>
  getAttemptReview(attemptId: string): Promise<QuestionReviewItem[]>
  createRetryAttempt(userId: string, sourceAttemptId: string): Promise<Attempt>
  getQuestionTypeStats(userId: string): Promise<QuestionTypeStat[]>
  listQuestionBankEntries(skill: Skill): Promise<QuestionBankEntry[]>
  getRealExamFlagSummary(testId: string, userId: string): Promise<Record<string, RealExamFlagSummary>>
  getRealExamFlagSummaryForSkill(skill: Skill, userId: string): Promise<Record<string, RealExamFlagSummary>>
  toggleRealExamFlag(userId: string, questionId: string, testId: string): Promise<RealExamFlagSummary>
  listExamReports(): Promise<ExamReport[]>
  createExamReport(input: {
    userId: string
    examDate: string
    testCenter: string
    questionIdsBySkill: Record<Skill, string[]>
  }): Promise<ExamReport>
  getExamReportDetail(id: string): Promise<ExamReportDetail | null>
  getLeaderboard(): Promise<LeaderboardEntry[]>
  createExamSession(userId: string): Promise<{ session: ExamSession; firstAttemptId: string }>
  advanceExamSession(
    sessionId: string,
    finishedSkill: Skill,
  ): Promise<{ done: true } | { done: false; nextAttemptId: string }>
  getExamSession(sessionId: string): Promise<ExamSession | null>
  listExamSessionsForUser(userId: string): Promise<ExamSession[]>
  getExamSessionSummary(sessionId: string): Promise<ExamSessionSummary | null>
}
