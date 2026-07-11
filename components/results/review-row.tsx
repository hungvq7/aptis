import { CheckIcon, XIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/** Shared "Đúng/Sai + your answer vs correct answer + explanation" visual, used by
 * the exam-result review section and the untimed practice mode's instant reveal. */
export function ReviewRow({
  prompt,
  isCorrect,
  yourAnswerSummary,
  correctAnswerSummary,
  explanation,
}: {
  prompt: string
  isCorrect: boolean
  yourAnswerSummary: string
  correctAnswerSummary: string
  explanation?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl border p-4 text-sm",
        isCorrect ? "border-green-500/30 bg-green-500/5" : "border-destructive/30 bg-destructive/5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium text-pretty">{prompt}</p>
        <Badge
          variant={isCorrect ? "default" : "destructive"}
          className={cn("shrink-0", isCorrect && "bg-green-600 text-white [a]:hover:bg-green-600/90")}
        >
          {isCorrect ? <CheckIcon /> : <XIcon />}
          {isCorrect ? "Đúng" : "Sai"}
        </Badge>
      </div>
      <p className="text-muted-foreground">
        Câu trả lời của bạn: <span className="text-foreground">{yourAnswerSummary}</span>
      </p>
      {!isCorrect ? (
        <p className="text-muted-foreground">
          Đáp án đúng: <span className="text-foreground">{correctAnswerSummary}</span>
        </p>
      ) : null}
      {explanation ? <p className="text-xs text-muted-foreground italic">Giải thích: {explanation}</p> : null}
    </div>
  )
}
