import { z } from "zod"

export const SKILLS = ["listening", "speaking", "reading", "writing"] as const
export type Skill = (typeof SKILLS)[number]

/** Real Aptis exam order for the combined mock-exam session (distinct from SKILLS' declaration order). */
export const MOCK_EXAM_SKILL_ORDER: Skill[] = ["speaking", "listening", "reading", "writing"]

// Placeholder/example list — not authoritative, easy to edit as real center
// names are confirmed.
export const TEST_CENTERS = [
  "Hội đồng Anh Hà Nội",
  "Hội đồng Anh TP. Hồ Chí Minh",
  "Hội đồng Anh Đà Nẵng",
  "IDP Hà Nội",
  "IDP TP. Hồ Chí Minh",
  "Không nhớ / Cơ sở khác",
] as const
export type TestCenter = (typeof TEST_CENTERS)[number]

export interface SkillMeta {
  id: Skill
  slug: string
  label: string
  shortLabel: string
  description: string
  icon: "headphones" | "mic" | "book-open" | "pen-line"
}

export const SKILL_META: Record<Skill, SkillMeta> = {
  listening: {
    id: "listening",
    slug: "nghe",
    label: "Nghe",
    shortLabel: "Listening",
    description: "Luyện kỹ năng nghe hiểu hội thoại và bài nói theo chuẩn Aptis.",
    icon: "headphones",
  },
  speaking: {
    id: "speaking",
    slug: "noi",
    label: "Nói",
    shortLabel: "Speaking",
    description: "Ghi âm phần trả lời và luyện phản xạ nói theo 4 phần thi Aptis.",
    icon: "mic",
  },
  reading: {
    id: "reading",
    slug: "doc",
    label: "Đọc",
    shortLabel: "Reading",
    description: "Luyện đọc hiểu từ vựng, sắp xếp câu, điền khuyết và ghép nối.",
    icon: "book-open",
  },
  writing: {
    id: "writing",
    slug: "viet",
    label: "Viết",
    shortLabel: "Writing",
    description: "Luyện viết câu trả lời ngắn, email và bài luận theo cấu trúc thi thật.",
    icon: "pen-line",
  },
}

export function skillBySlug(slug: string): Skill | null {
  const found = (Object.values(SKILL_META) as SkillMeta[]).find((m) => m.slug === slug)
  return found ? found.id : null
}

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

export interface QuestionOption {
  id: string
  label: string
}

export interface MultipleChoiceQuestion {
  id: string
  type: "multiple-choice"
  prompt: string
  options: QuestionOption[]
  correctOptionId: string
  explanation?: string
}

export interface ReorderQuestion {
  id: string
  type: "reorder"
  instructions?: string
  items: QuestionOption[]
  correctOrder: string[]
  explanation?: string
}

export interface GapFillGap {
  id: string
  options: QuestionOption[]
  correctOptionId: string
}

export interface GapFillQuestion {
  id: string
  type: "gap-fill"
  /** Passage text with `{{gapId}}` tokens marking each blank. */
  passageTemplate: string
  gaps: GapFillGap[]
  explanation?: string
}

export interface MatchingQuestion {
  id: string
  type: "matching"
  prompts: QuestionOption[]
  options: QuestionOption[]
  correctMap: Record<string, string>
  explanation?: string
}

export interface ShortAnswerQuestion {
  id: string
  type: "short-answer"
  prompt: string
  minWords: number
  maxWords: number
}

export interface EssayQuestion {
  id: string
  type: "essay"
  prompt: string
  minWords: number
  maxWords: number
  timeLimitMinutes?: number
}

export interface SpeakingPromptQuestion {
  id: string
  type: "speaking-prompt"
  prompt: string
  imageUrls?: string[]
  prepSeconds: number
  recordSeconds: number
}

export type Question =
  | MultipleChoiceQuestion
  | ReorderQuestion
  | GapFillQuestion
  | MatchingQuestion
  | ShortAnswerQuestion
  | EssayQuestion
  | SpeakingPromptQuestion

export type QuestionType = Question["type"]

export interface PassageBlock {
  id: string
  title?: string
  body: string
}

export interface Part {
  id: string
  order: number
  title: string
  instructions: string
  /** Reading long-text passage(s) shown alongside the questions, or short opinion texts for matching parts. */
  passages?: PassageBlock[]
  /** Listening audio clip id for this part; resolved to a URL via lib/data/mock/audio-config.ts */
  audioClipId?: string
  questions: Question[]
}

export interface Test {
  id: string
  skill: Skill
  title: string
  description: string
  durationMinutes: number
  parts: Part[]
}

// ---------------------------------------------------------------------------
// Answers
// ---------------------------------------------------------------------------

export interface MultipleChoiceAnswer {
  questionId: string
  type: "multiple-choice"
  selectedOptionId: string | null
}

export interface ReorderAnswer {
  questionId: string
  type: "reorder"
  order: string[]
}

export interface GapFillAnswer {
  questionId: string
  type: "gap-fill"
  gapAnswers: Record<string, string>
}

export interface MatchingAnswer {
  questionId: string
  type: "matching"
  matchAnswers: Record<string, string>
}

export interface ShortAnswerAnswer {
  questionId: string
  type: "short-answer"
  text: string
}

export interface EssayAnswer {
  questionId: string
  type: "essay"
  text: string
}

export interface SpeakingPromptAnswer {
  questionId: string
  type: "speaking-prompt"
  // No backend audio storage yet — this pass only records completion metadata.
  // TODO(storage): persist the recorded audio blob once ERPNext/file storage is wired up.
  hasRecording: boolean
  durationSeconds?: number
}

export type Answer =
  | MultipleChoiceAnswer
  | ReorderAnswer
  | GapFillAnswer
  | MatchingAnswer
  | ShortAnswerAnswer
  | EssayAnswer
  | SpeakingPromptAnswer

// ---------------------------------------------------------------------------
// Attempts & results
// ---------------------------------------------------------------------------

export type AttemptStatus = "in-progress" | "submitted" | "scored"

export interface Attempt {
  id: string
  userId: string
  testId: string
  skill: Skill
  startedAt: string
  submittedAt?: string
  status: AttemptStatus
  answers: Answer[]
  bookmarkedQuestionIds: string[]
  /** Set when this attempt is one skill of a combined mock-exam session — see ExamSession. */
  examSessionId?: string
}

export interface PartScore {
  partId: string
  title: string
  scoreRaw: number
  scoreMax: number
  /** True when this part contains subjective (essay/speaking) items that need human/AI review. */
  needsReview: boolean
}

export interface Result {
  attemptId: string
  testId: string
  skill: Skill
  submittedAt: string
  scoreRaw: number
  scoreMax: number
  scorePercent: number
  perPartBreakdown: PartScore[]
}

/** One question in the untimed practice/browse mode's flattened question bank listing. */
export interface QuestionBankEntry {
  question: Question
  partId: string
  partTitle: string
  testId: string
  testTitle: string
  /** The source part's reading passage(s)/opinion texts, if any — needed to render matching/reorder questions with proper context in practice mode. */
  passages?: PassageBlock[]
}

/**
 * A user-submitted recollection of a real exam sitting: date + test center +
 * which question-bank questions matched what appeared, per skill. This is
 * the "Review đề" top-level section — a compiled, community-visible record
 * of a real exam, distinct from the per-question RealExamFlag community tag.
 */
export interface ExamReport {
  id: string
  examDate: string
  testCenter: string
  submittedByUserId: string
  submittedAt: string
  questionIdsBySkill: Record<Skill, string[]>
}

/** ExamReport with the stored question ids resolved back to full question content, for the detail view. */
export interface ExamReportDetail extends ExamReport {
  sections: { skill: Skill; entries: QuestionBankEntry[] }[]
}

/**
 * A shared, crowd-sourced confirmation that a question actually appeared on a
 * real exam sitting ("Review đề"). One row per (user, question) — a
 * question's total confirmations = number of rows for that questionId.
 */
export interface RealExamFlag {
  id: string
  questionId: string
  testId: string
  userId: string
  flaggedAt: string
}

/** Per-question flag summary: how many users confirmed it, and whether the current user did. */
export interface RealExamFlagSummary {
  count: number
  flaggedByMe: boolean
}

/** One row in the post-submission "review your answers" section — objective question types only. */
export interface QuestionReviewItem {
  questionId: string
  partId: string
  partTitle: string
  questionType: QuestionType
  prompt: string
  isCorrect: boolean
  yourAnswerSummary: string
  correctAnswerSummary: string
  explanation?: string
}

/**
 * A combined mock exam: chains one Attempt per skill in MOCK_EXAM_SKILL_ORDER,
 * each against a freshly randomized synthetic Test, so the user experiences
 * one continuous simulated real exam instead of 4 separate practice tests.
 */
export interface ExamSession {
  id: string
  userId: string
  attemptIds: Partial<Record<Skill, string>>
  status: "in-progress" | "completed"
  startedAt: string
  completedAt?: string
}

/** ExamSession with each skill's test/result/review resolved, for the combined results page. */
export interface ExamSessionSummary {
  session: ExamSession
  bySkill: Partial<Record<Skill, { test: Test; result: Result; review: QuestionReviewItem[] }>>
}

/** Accuracy (or completion rate, for subjective types) aggregated per question type across a user's scored attempts. */
export interface QuestionTypeStat {
  questionType: QuestionType
  label: string
  correct: number
  total: number
  accuracyPercent: number | null
  /** True for short-answer/essay/speaking-prompt — "correct" there is really a completion stub, not a real accuracy measure. */
  isCompletionOnly: boolean
}

/** Consecutive-day practice streak, derived from a user's attempt activity dates. */
export interface StreakInfo {
  currentStreak: number
  longestStreak: number
  practicedToday: boolean
}

/** An achievement in the fixed badge catalog, with whether the current user has earned it. */
export interface Badge {
  id: string
  label: string
  description: string
  icon: string
  earned: boolean
}

/** One ranked row in the cross-user leaderboard. */
export interface LeaderboardEntry {
  userId: string
  name: string
  avgScorePercent: number
  scoredAttemptCount: number
  rank: number
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

/** Server-side only — never send passwordHash to the client. */
export interface User {
  id: string
  email: string
  name: string
  passwordHash: string
  createdAt: string
}

/** Client-safe subset of User, embedded in the session cookie. */
export interface SessionUser {
  id: string
  email: string
  name: string
}

// ---------------------------------------------------------------------------
// Zod schemas — used by lib/data/mock/store.ts to validate JSON on read so a
// hand-edited or corrupted data file fails loudly instead of silently.
// ---------------------------------------------------------------------------

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  passwordHash: z.string(),
  createdAt: z.string(),
})

export const realExamFlagSchema = z.object({
  id: z.string(),
  questionId: z.string(),
  testId: z.string(),
  userId: z.string(),
  flaggedAt: z.string(),
})

export const examReportSchema = z.object({
  id: z.string(),
  examDate: z.string(),
  testCenter: z.string(),
  submittedByUserId: z.string(),
  submittedAt: z.string(),
  questionIdsBySkill: z.record(z.enum(SKILLS), z.array(z.string())),
})

export const answerSchema: z.ZodType<Answer> = z.discriminatedUnion("type", [
  z.object({
    questionId: z.string(),
    type: z.literal("multiple-choice"),
    selectedOptionId: z.string().nullable(),
  }),
  z.object({
    questionId: z.string(),
    type: z.literal("reorder"),
    order: z.array(z.string()),
  }),
  z.object({
    questionId: z.string(),
    type: z.literal("gap-fill"),
    gapAnswers: z.record(z.string(), z.string()),
  }),
  z.object({
    questionId: z.string(),
    type: z.literal("matching"),
    matchAnswers: z.record(z.string(), z.string()),
  }),
  z.object({
    questionId: z.string(),
    type: z.literal("short-answer"),
    text: z.string(),
  }),
  z.object({
    questionId: z.string(),
    type: z.literal("essay"),
    text: z.string(),
  }),
  z.object({
    questionId: z.string(),
    type: z.literal("speaking-prompt"),
    hasRecording: z.boolean(),
    durationSeconds: z.number().optional(),
  }),
])

export const attemptSchema = z.object({
  id: z.string(),
  userId: z.string(),
  testId: z.string(),
  skill: z.enum(SKILLS),
  startedAt: z.string(),
  submittedAt: z.string().optional(),
  status: z.enum(["in-progress", "submitted", "scored"]),
  answers: z.array(answerSchema),
  // Backfills to [] for attempts persisted before bookmarking existed.
  bookmarkedQuestionIds: z.array(z.string()).optional().default([]),
  examSessionId: z.string().optional(),
})

export const examSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  // partialRecord — not every skill has an attemptId until the session reaches that skill.
  attemptIds: z.partialRecord(z.enum(SKILLS), z.string()),
  status: z.enum(["in-progress", "completed"]),
  startedAt: z.string(),
  completedAt: z.string().optional(),
})

export const resultSchema = z.object({
  attemptId: z.string(),
  testId: z.string(),
  skill: z.enum(SKILLS),
  submittedAt: z.string(),
  scoreRaw: z.number(),
  scoreMax: z.number(),
  scorePercent: z.number(),
  perPartBreakdown: z.array(
    z.object({
      partId: z.string(),
      title: z.string(),
      scoreRaw: z.number(),
      scoreMax: z.number(),
      needsReview: z.boolean(),
    }),
  ),
})

// ---------------------------------------------------------------------------
// Question / Test schemas — only needed to validate the synthetic "retry
// wrong questions" tests persisted to data/synthetic-tests.json. Static
// ALL_TESTS content stays plain authored TS (typechecked, not JSON-validated).
// ---------------------------------------------------------------------------

const questionOptionSchema = z.object({ id: z.string(), label: z.string() })

export const questionSchema: z.ZodType<Question> = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    type: z.literal("multiple-choice"),
    prompt: z.string(),
    options: z.array(questionOptionSchema),
    correctOptionId: z.string(),
    explanation: z.string().optional(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("reorder"),
    instructions: z.string().optional(),
    items: z.array(questionOptionSchema),
    correctOrder: z.array(z.string()),
    explanation: z.string().optional(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("gap-fill"),
    passageTemplate: z.string(),
    gaps: z.array(
      z.object({
        id: z.string(),
        options: z.array(questionOptionSchema),
        correctOptionId: z.string(),
      }),
    ),
    explanation: z.string().optional(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("matching"),
    prompts: z.array(questionOptionSchema),
    options: z.array(questionOptionSchema),
    correctMap: z.record(z.string(), z.string()),
    explanation: z.string().optional(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("short-answer"),
    prompt: z.string(),
    minWords: z.number(),
    maxWords: z.number(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("essay"),
    prompt: z.string(),
    minWords: z.number(),
    maxWords: z.number(),
    timeLimitMinutes: z.number().optional(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("speaking-prompt"),
    prompt: z.string(),
    imageUrls: z.array(z.string()).optional(),
    prepSeconds: z.number(),
    recordSeconds: z.number(),
  }),
])

const passageBlockSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  body: z.string(),
})

const partSchema = z.object({
  id: z.string(),
  order: z.number(),
  title: z.string(),
  instructions: z.string(),
  passages: z.array(passageBlockSchema).optional(),
  audioClipId: z.string().optional(),
  questions: z.array(questionSchema),
})

export const testSchema = z.object({
  id: z.string(),
  skill: z.enum(SKILLS),
  title: z.string(),
  description: z.string(),
  durationMinutes: z.number(),
  parts: z.array(partSchema),
})
