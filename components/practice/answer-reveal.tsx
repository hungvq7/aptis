import { InfoIcon } from "lucide-react"
import { ReviewRow } from "@/components/results/review-row"
import { evaluateQuestion, promptTextFor, type PartRef } from "@/lib/data/question-content"
import type { Answer, Question } from "@/lib/data/types"

export function AnswerReveal({
  question,
  part,
  answer,
}: {
  question: Question
  part: PartRef
  answer: Answer | undefined
}) {
  const evaluated = evaluateQuestion(question, part, answer)

  if (evaluated.score.needsReview) {
    return (
      <div className="flex items-start gap-2 rounded-2xl border border-border/60 bg-secondary/50 p-4 text-sm text-secondary-foreground">
        <InfoIcon className="mt-0.5 size-4 shrink-0" />
        <p>
          Dạng câu hỏi này cần người chấm hoặc AI đánh giá — chưa có đáp án mẫu duy nhất để đối chiếu. Hãy tự
          xem lại câu trả lời của bạn dựa trên yêu cầu của đề bài.
        </p>
      </div>
    )
  }

  return (
    <ReviewRow
      prompt={promptTextFor(question, part)}
      isCorrect={evaluated.isCorrect}
      yourAnswerSummary={evaluated.yourAnswerSummary}
      correctAnswerSummary={evaluated.correctAnswerSummary}
      explanation={"explanation" in question ? question.explanation : undefined}
    />
  )
}
