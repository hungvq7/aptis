import { SKILLS, type Attempt, type Badge, type Result, type StreakInfo } from "@/lib/data/types"

const BADGE_CATALOG: Omit<Badge, "earned">[] = [
  { id: "khoi-dong", label: "Khởi động", description: "Hoàn thành lượt luyện tập đầu tiên", icon: "rocket" },
  { id: "cham-chi", label: "Chăm chỉ", description: "Luyện tập 3 ngày liên tiếp", icon: "flame" },
  { id: "kien-tri", label: "Kiên trì", description: "Đạt chuỗi 7 ngày luyện tập liên tiếp", icon: "trophy" },
  { id: "du-4-ky-nang", label: "Đủ 4 kỹ năng", description: "Hoàn thành ít nhất 1 bài ở cả 4 kỹ năng", icon: "sparkles" },
  { id: "100-cau", label: "100 câu", description: "Trả lời tổng cộng 100 câu hỏi", icon: "target" },
  { id: "diem-xuat-sac", label: "Điểm xuất sắc", description: "Đạt từ 90% điểm trở lên trong một bài thi", icon: "award" },
]

/** Evaluates the fixed badge catalog against a user's attempts/results/streak. Always returns all badges (earned: boolean). */
export function computeBadges(attempts: Attempt[], results: Result[], streak: StreakInfo): Badge[] {
  const completedAttempts = attempts.filter((attempt) => attempt.status !== "in-progress")
  const totalAnswered = attempts.reduce((sum, attempt) => sum + attempt.answers.length, 0)
  const skillsCovered = new Set(completedAttempts.map((attempt) => attempt.skill))

  const earnedById: Record<string, boolean> = {
    "khoi-dong": completedAttempts.length > 0,
    "cham-chi": streak.currentStreak >= 3,
    "kien-tri": streak.longestStreak >= 7,
    "du-4-ky-nang": SKILLS.every((skill) => skillsCovered.has(skill)),
    "100-cau": totalAnswered >= 100,
    "diem-xuat-sac": results.some((result) => result.scorePercent >= 90),
  }

  return BADGE_CATALOG.map((badge) => ({ ...badge, earned: earnedById[badge.id] ?? false }))
}
