import { randomUUID } from "crypto"
import type {
  Answer,
  Attempt,
  ExamReport,
  ExamReportDetail,
  ExamSession,
  ExamSessionSummary,
  LeaderboardEntry,
  PartScore,
  QuestionBankEntry,
  QuestionOption,
  QuestionReviewItem,
  QuestionTypeStat,
  RealExamFlagSummary,
  Result,
  Skill,
  Test,
} from "@/lib/data/types"
import { MOCK_EXAM_SKILL_ORDER, SKILLS } from "@/lib/data/types"
import type { TestRepository } from "@/lib/data/test-repository"
import { ALL_TESTS, TESTS_BY_SKILL } from "@/lib/data/mock/questions"
import {
  attemptsCollection,
  examReportsCollection,
  examSessionsCollection,
  realExamFlagsCollection,
  resultsCollection,
  syntheticTestsCollection,
  usersCollection,
} from "@/lib/data/mock/collections"
import { scoreQuestion } from "@/lib/data/question-scoring"
import { promptTextFor } from "@/lib/data/question-content"
import { evaluateAttemptQuestions } from "@/lib/data/mock/answer-summary"
import { computeQuestionTypeStats } from "@/lib/data/aggregate-question-type-stats"

const OBJECTIVE_QUESTION_TYPES = new Set(["multiple-choice", "reorder", "gap-fill", "matching"])

export class MockTestRepository implements TestRepository {
  async listTests(skill?: Skill): Promise<Test[]> {
    return skill ? TESTS_BY_SKILL[skill] : ALL_TESTS
  }

  async getTest(testId: string): Promise<Test | null> {
    const fromStatic = ALL_TESTS.find((test) => test.id === testId)
    if (fromStatic) return fromStatic
    return syntheticTestsCollection.findByKey(testId)
  }

  async createAttempt(userId: string, testId: string, examSessionId?: string): Promise<Attempt> {
    const test = await this.getTest(testId)
    if (!test) throw new Error(`Unknown test: ${testId}`)
    const attempt: Attempt = {
      id: randomUUID(),
      userId,
      testId,
      skill: test.skill,
      startedAt: new Date().toISOString(),
      status: "in-progress",
      answers: [],
      bookmarkedQuestionIds: [],
      ...(examSessionId ? { examSessionId } : {}),
    }
    return attemptsCollection.insert(attempt)
  }

  async getAttempt(attemptId: string): Promise<Attempt | null> {
    return attemptsCollection.findByKey(attemptId)
  }

  async saveAnswer(attemptId: string, answer: Answer): Promise<void> {
    const updated = await attemptsCollection.update(attemptId, (attempt) => {
      const answers = attempt.answers.filter((existing) => existing.questionId !== answer.questionId)
      answers.push(answer)
      return { ...attempt, answers }
    })
    if (!updated) throw new Error(`Unknown attempt: ${attemptId}`)
  }

  async submitAttempt(attemptId: string): Promise<Result> {
    const attempt = await attemptsCollection.findByKey(attemptId)
    if (!attempt) throw new Error(`Unknown attempt: ${attemptId}`)
    const test = await this.getTest(attempt.testId)
    if (!test) throw new Error(`Unknown test: ${attempt.testId}`)

    const answerByQuestionId = new Map(attempt.answers.map((answer) => [answer.questionId, answer]))
    const perPartBreakdown: PartScore[] = test.parts.map((part) => {
      let scoreRaw = 0
      let scoreMax = 0
      let needsReview = false
      for (const question of part.questions) {
        const result = scoreQuestion(question, answerByQuestionId.get(question.id))
        scoreRaw += result.scoreRaw
        scoreMax += result.scoreMax
        needsReview = needsReview || result.needsReview
      }
      return { partId: part.id, title: part.title, scoreRaw, scoreMax, needsReview }
    })

    const scoreRaw = perPartBreakdown.reduce((sum, part) => sum + part.scoreRaw, 0)
    const scoreMax = perPartBreakdown.reduce((sum, part) => sum + part.scoreMax, 0)
    const submittedAt = new Date().toISOString()

    const result: Result = {
      attemptId: attempt.id,
      testId: attempt.testId,
      skill: attempt.skill,
      submittedAt,
      scoreRaw,
      scoreMax,
      scorePercent: scoreMax > 0 ? Math.round((scoreRaw / scoreMax) * 100) : 0,
      perPartBreakdown,
    }

    await resultsCollection.insert(result)
    await attemptsCollection.update(attemptId, (a) => ({ ...a, status: "scored", submittedAt }))

    return result
  }

  async listAttemptsForUser(userId: string, skill?: Skill): Promise<Attempt[]> {
    return attemptsCollection.findMany(
      (attempt) => attempt.userId === userId && (!skill || attempt.skill === skill),
    )
  }

  async getResult(attemptId: string): Promise<Result | null> {
    return resultsCollection.findByKey(attemptId)
  }

  async setBookmark(attemptId: string, questionId: string, bookmarked: boolean): Promise<void> {
    const updated = await attemptsCollection.update(attemptId, (attempt) => {
      const current = new Set(attempt.bookmarkedQuestionIds ?? [])
      if (bookmarked) current.add(questionId)
      else current.delete(questionId)
      return { ...attempt, bookmarkedQuestionIds: [...current] }
    })
    if (!updated) throw new Error(`Unknown attempt: ${attemptId}`)
  }

  async getAttemptReview(attemptId: string): Promise<QuestionReviewItem[]> {
    const attempt = await attemptsCollection.findByKey(attemptId)
    if (!attempt) throw new Error(`Unknown attempt: ${attemptId}`)
    const test = await this.getTest(attempt.testId)
    if (!test) throw new Error(`Unknown test: ${attempt.testId}`)

    return evaluateAttemptQuestions(test, attempt)
      .filter((evaluated) => OBJECTIVE_QUESTION_TYPES.has(evaluated.question.type))
      .map((evaluated) => ({
        questionId: evaluated.question.id,
        partId: evaluated.part.id,
        partTitle: evaluated.part.title,
        questionType: evaluated.question.type,
        prompt: promptTextFor(evaluated.question, evaluated.part),
        isCorrect: evaluated.isCorrect,
        yourAnswerSummary: evaluated.yourAnswerSummary,
        correctAnswerSummary: evaluated.correctAnswerSummary,
        explanation: "explanation" in evaluated.question ? evaluated.question.explanation : undefined,
      }))
  }

  async createRetryAttempt(userId: string, sourceAttemptId: string): Promise<Attempt> {
    const sourceAttempt = await attemptsCollection.findByKey(sourceAttemptId)
    if (!sourceAttempt) throw new Error(`Unknown attempt: ${sourceAttemptId}`)
    const sourceTest = await this.getTest(sourceAttempt.testId)
    if (!sourceTest) throw new Error(`Unknown test: ${sourceAttempt.testId}`)

    const wrongQuestions = evaluateAttemptQuestions(sourceTest, sourceAttempt)
      .filter((evaluated) => OBJECTIVE_QUESTION_TYPES.has(evaluated.question.type) && !evaluated.isCorrect)
      .map((evaluated) => evaluated.question)

    if (wrongQuestions.length === 0) throw new Error("No incorrect questions to retry")

    const syntheticTest: Test = {
      id: `retry-${randomUUID()}`,
      skill: sourceTest.skill,
      title: `Ôn tập câu sai — ${sourceTest.title}`,
      description: "Đề luyện tập tự động tạo từ các câu bạn đã trả lời sai.",
      durationMinutes: Math.max(10, Math.ceil(wrongQuestions.length * 1.5)),
      parts: [
        {
          id: `retry-${sourceAttemptId}`,
          order: 1,
          title: "Câu hỏi cần ôn tập",
          instructions: "Làm lại các câu bạn đã trả lời sai trong lần thi trước.",
          questions: wrongQuestions,
        },
      ],
    }
    await syntheticTestsCollection.insert(syntheticTest)
    return this.createAttempt(userId, syntheticTest.id)
  }

  /** Fisher-Yates shuffles each part's question order (and MC option order) to produce a "randomized" exam per session. */
  private buildRandomizedTest(sourceTest: Test, idSuffix: string): Test {
    function shuffle<T>(items: T[]): T[] {
      const copy = [...items]
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
      }
      return copy
    }

    return {
      ...sourceTest,
      id: `mock-${idSuffix}-${sourceTest.skill}`,
      title: `${sourceTest.title} — Thi thử tổng hợp`,
      parts: sourceTest.parts.map((part) => ({
        ...part,
        questions: shuffle(part.questions).map((question) =>
          question.type === "multiple-choice" ? { ...question, options: shuffle(question.options) } : question,
        ),
      })),
    }
  }

  async createExamSession(userId: string): Promise<{ session: ExamSession; firstAttemptId: string }> {
    const sessionId = randomUUID()
    const firstSkill = MOCK_EXAM_SKILL_ORDER[0]
    const sourceTest = TESTS_BY_SKILL[firstSkill][0]
    const syntheticTest = this.buildRandomizedTest(sourceTest, sessionId)
    await syntheticTestsCollection.insert(syntheticTest)
    const attempt = await this.createAttempt(userId, syntheticTest.id, sessionId)

    const session: ExamSession = {
      id: sessionId,
      userId,
      attemptIds: { [firstSkill]: attempt.id },
      status: "in-progress",
      startedAt: new Date().toISOString(),
    }
    await examSessionsCollection.insert(session)
    return { session, firstAttemptId: attempt.id }
  }

  async advanceExamSession(
    sessionId: string,
    finishedSkill: Skill,
  ): Promise<{ done: true } | { done: false; nextAttemptId: string }> {
    const session = await examSessionsCollection.findByKey(sessionId)
    if (!session) throw new Error(`Unknown exam session: ${sessionId}`)

    const nextSkill = MOCK_EXAM_SKILL_ORDER[MOCK_EXAM_SKILL_ORDER.indexOf(finishedSkill) + 1]

    // Idempotent against duplicate advance calls (double-submit, browser back button):
    // if the next skill already has an attempt recorded, hand back that same one
    // instead of minting a second attempt for it.
    if (nextSkill && session.attemptIds[nextSkill]) {
      return { done: false, nextAttemptId: session.attemptIds[nextSkill]! }
    }

    if (!nextSkill) {
      if (session.status !== "completed") {
        await examSessionsCollection.update(sessionId, (s) => ({
          ...s,
          status: "completed",
          completedAt: new Date().toISOString(),
        }))
      }
      return { done: true }
    }

    const sourceTest = TESTS_BY_SKILL[nextSkill][0]
    const syntheticTest = this.buildRandomizedTest(sourceTest, sessionId)
    await syntheticTestsCollection.insert(syntheticTest)
    const attempt = await this.createAttempt(session.userId, syntheticTest.id, sessionId)

    const updated = await examSessionsCollection.update(sessionId, (s) =>
      s.attemptIds[nextSkill] ? s : { ...s, attemptIds: { ...s.attemptIds, [nextSkill]: attempt.id } },
    )

    return { done: false, nextAttemptId: updated?.attemptIds[nextSkill] ?? attempt.id }
  }

  async getExamSession(sessionId: string): Promise<ExamSession | null> {
    return examSessionsCollection.findByKey(sessionId)
  }

  async listExamSessionsForUser(userId: string): Promise<ExamSession[]> {
    return examSessionsCollection.findMany((session) => session.userId === userId)
  }

  async getExamSessionSummary(sessionId: string): Promise<ExamSessionSummary | null> {
    const session = await examSessionsCollection.findByKey(sessionId)
    if (!session) return null

    const bySkill: ExamSessionSummary["bySkill"] = {}
    for (const skill of MOCK_EXAM_SKILL_ORDER) {
      const attemptId = session.attemptIds[skill]
      if (!attemptId) continue
      const attempt = await this.getAttempt(attemptId)
      if (!attempt) continue
      const [test, result, review] = await Promise.all([
        this.getTest(attempt.testId),
        this.getResult(attemptId),
        this.getAttemptReview(attemptId),
      ])
      if (test && result) bySkill[skill] = { test, result, review }
    }

    return { session, bySkill }
  }

  async getQuestionTypeStats(userId: string): Promise<QuestionTypeStat[]> {
    const attempts = await this.listAttemptsForUser(userId)
    const scored = attempts.filter((attempt) => attempt.status === "scored")
    const tallies: Record<string, { correct: number; total: number }> = {}

    for (const attempt of scored) {
      const test = await this.getTest(attempt.testId)
      if (!test) continue
      for (const evaluated of evaluateAttemptQuestions(test, attempt)) {
        const key = evaluated.question.type
        tallies[key] ??= { correct: 0, total: 0 }
        tallies[key].total += 1
        // For objective types this is real correctness; for short-answer/essay/
        // speaking-prompt (needsReview: true) this is the completion stub
        // reaching its max score — i.e. "completion rate", per QuestionTypeStat.isCompletionOnly.
        if (evaluated.score.scoreMax > 0 && evaluated.score.scoreRaw === evaluated.score.scoreMax) {
          tallies[key].correct += 1
        }
      }
    }

    return computeQuestionTypeStats(tallies)
  }

  async listQuestionBankEntries(skill: Skill): Promise<QuestionBankEntry[]> {
    const tests = TESTS_BY_SKILL[skill]
    return tests.flatMap((test) =>
      test.parts.flatMap((part) =>
        part.questions.map((question) => ({
          question,
          partId: part.id,
          partTitle: part.title,
          testId: test.id,
          testTitle: test.title,
          passages: part.passages,
        })),
      ),
    )
  }

  async getRealExamFlagSummary(testId: string, userId: string): Promise<Record<string, RealExamFlagSummary>> {
    const flags = await realExamFlagsCollection.findMany((flag) => flag.testId === testId)
    return summarizeFlags(flags, userId)
  }

  async getRealExamFlagSummaryForSkill(
    skill: Skill,
    userId: string,
  ): Promise<Record<string, RealExamFlagSummary>> {
    const testIds = new Set(TESTS_BY_SKILL[skill].map((test) => test.id))
    const flags = await realExamFlagsCollection.findMany((flag) => testIds.has(flag.testId))
    return summarizeFlags(flags, userId)
  }

  async toggleRealExamFlag(userId: string, questionId: string, testId: string): Promise<RealExamFlagSummary> {
    const existing = await realExamFlagsCollection.findMany(
      (flag) => flag.userId === userId && flag.questionId === questionId,
    )
    if (existing.length > 0) {
      await realExamFlagsCollection.removeMany((flag) => flag.userId === userId && flag.questionId === questionId)
    } else {
      await realExamFlagsCollection.insert({
        id: randomUUID(),
        questionId,
        testId,
        userId,
        flaggedAt: new Date().toISOString(),
      })
    }
    const flagsForQuestion = await realExamFlagsCollection.findMany((flag) => flag.questionId === questionId)
    return {
      count: flagsForQuestion.length,
      flaggedByMe: flagsForQuestion.some((flag) => flag.userId === userId),
    }
  }

  async listExamReports(): Promise<ExamReport[]> {
    return examReportsCollection.all()
  }

  async createExamReport(input: {
    userId: string
    examDate: string
    testCenter: string
    questionIdsBySkill: Record<Skill, string[]>
  }): Promise<ExamReport> {
    const report: ExamReport = {
      id: randomUUID(),
      examDate: input.examDate,
      testCenter: input.testCenter,
      submittedByUserId: input.userId,
      submittedAt: new Date().toISOString(),
      questionIdsBySkill: input.questionIdsBySkill,
    }
    return examReportsCollection.insert(report)
  }

  async getExamReportDetail(id: string): Promise<ExamReportDetail | null> {
    const report = await examReportsCollection.findByKey(id)
    if (!report) return null

    const sections = await Promise.all(
      SKILLS.map(async (skill) => {
        const ids = new Set(report.questionIdsBySkill[skill] ?? [])
        const entries = (await this.listQuestionBankEntries(skill)).filter((entry) => ids.has(entry.question.id))
        return { skill, entries }
      }),
    )

    return { ...report, sections }
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const users = await usersCollection.all()
    const attempts = await attemptsCollection.all()
    const results = await resultsCollection.all()
    const attemptUserById = new Map(attempts.map((attempt) => [attempt.id, attempt.userId]))

    const rows = users
      .map((user) => {
        const scored = results.filter((result) => attemptUserById.get(result.attemptId) === user.id)
        const avgScorePercent =
          scored.length > 0
            ? Math.round(scored.reduce((sum, result) => sum + result.scorePercent, 0) / scored.length)
            : 0
        return { userId: user.id, name: user.name, avgScorePercent, scoredAttemptCount: scored.length }
      })
      .filter((row) => row.scoredAttemptCount > 0)

    rows.sort((a, b) => b.avgScorePercent - a.avgScorePercent || b.scoredAttemptCount - a.scoredAttemptCount)

    return rows.map((row, index) => ({ ...row, rank: index + 1 }))
  }
}

function summarizeFlags(
  flags: { questionId: string; userId: string }[],
  userId: string,
): Record<string, RealExamFlagSummary> {
  const summary: Record<string, RealExamFlagSummary> = {}
  for (const flag of flags) {
    summary[flag.questionId] ??= { count: 0, flaggedByMe: false }
    summary[flag.questionId].count += 1
    if (flag.userId === userId) summary[flag.questionId].flaggedByMe = true
  }
  return summary
}
