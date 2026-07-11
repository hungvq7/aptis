import { ReviewRow } from "@/components/results/review-row"
import type { QuestionReviewItem } from "@/lib/data/types"

export function QuestionReviewList({ items }: { items: QuestionReviewItem[] }) {
  if (items.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <ReviewRow
          key={item.questionId}
          prompt={item.prompt}
          isCorrect={item.isCorrect}
          yourAnswerSummary={item.yourAnswerSummary}
          correctAnswerSummary={item.correctAnswerSummary}
          explanation={item.explanation}
        />
      ))}
    </div>
  )
}
