"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { BookmarkIcon, BookmarkCheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDebouncedCallback } from "@/hooks/use-debounced-callback"
import { TimerDisplay } from "@/components/test-runner/timer-display"
import { BottomToolbar } from "@/components/test-runner/bottom-toolbar"
import { QuestionListSheet } from "@/components/test-runner/question-list-sheet"
import { PartContent } from "@/components/test-runner/part-content"
import {
  MOCK_EXAM_SKILL_ORDER,
  SKILL_META,
  type Answer,
  type Attempt,
  type EssayQuestion,
  type Test,
} from "@/lib/data/types"

export function TestRunnerShell({
  test,
  attempt,
  examSessionId,
}: {
  test: Test
  attempt: Attempt
  /** Set when this attempt is one skill of a combined mock-exam session — submitting chains to the next skill instead of the single-skill result page. */
  examSessionId?: string
}) {
  const router = useRouter()
  const [currentPartIndex, setCurrentPartIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, Answer>>(() =>
    Object.fromEntries(attempt.answers.map((answer) => [answer.questionId, answer])),
  )
  // Mirrors `answers` synchronously (not just after a re-render) so handleSubmit
  // can flush the latest answers even if called immediately after a change.
  const answersRef = React.useRef(answers)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [visitedPartIndices, setVisitedPartIndices] = React.useState<Set<number>>(() => new Set([0]))
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = React.useState<Set<string>>(
    () => new Set(attempt.bookmarkedQuestionIds ?? []),
  )
  const [isQuestionListOpen, setIsQuestionListOpen] = React.useState(false)

  const [remainingSeconds, setRemainingSeconds] = React.useState(() => {
    const elapsedSeconds = Math.floor((Date.now() - new Date(attempt.startedAt).getTime()) / 1000)
    return Math.max(0, test.durationMinutes * 60 - elapsedSeconds)
  })

  const parts = [...test.parts].sort((a, b) => a.order - b.order)
  const currentPart = parts[currentPartIndex]
  const totalQuestions = parts.reduce((sum, part) => sum + part.questions.length, 0)
  const answeredCount = Object.keys(answers).length
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0

  const currentPartQuestionIds = React.useMemo(
    () => currentPart.questions.map((question) => question.id),
    [currentPart],
  )
  const isCurrentPartBookmarked =
    currentPartQuestionIds.length > 0 && currentPartQuestionIds.every((id) => bookmarkedQuestionIds.has(id))

  const debouncedSave = useDebouncedCallback((answer: Answer) => {
    fetch(`/api/attempts/${attempt.id}/answers`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    }).catch(() => {
      toast.error("Không thể lưu câu trả lời, vui lòng kiểm tra kết nối mạng")
    })
  }, 800)

  function handleAnswerChange(answer: Answer) {
    setAnswers((prev) => {
      const next = { ...prev, [answer.questionId]: answer }
      answersRef.current = next
      return next
    })
    debouncedSave(answer)
  }

  function goToPart(index: number) {
    setCurrentPartIndex(index)
    setVisitedPartIndices((prev) => new Set(prev).add(index))
  }

  function handleBookmarkToggle() {
    const nextBookmarked = !isCurrentPartBookmarked
    setBookmarkedQuestionIds((prev) => {
      const next = new Set(prev)
      for (const id of currentPartQuestionIds) {
        if (nextBookmarked) next.add(id)
        else next.delete(id)
      }
      return next
    })
    for (const questionId of currentPartQuestionIds) {
      fetch(`/api/attempts/${attempt.id}/bookmarks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, bookmarked: nextBookmarked }),
      }).catch(() => toast.error("Không thể lưu đánh dấu, vui lòng kiểm tra kết nối mạng"))
    }
  }

  function handleExit() {
    router.push("/bang-dieu-khien")
  }

  const handleSubmit = React.useCallback(async () => {
    setIsSubmitting(true)
    try {
      // The autosave PATCH is debounced (see useDebouncedCallback above), so a
      // question answered right before hitting submit may not have reached
      // the server yet. Flush every locally-known answer first so submitting
      // never silently drops the most recent answer(s).
      await Promise.all(
        Object.values(answersRef.current).map((answer) =>
          fetch(`/api/attempts/${attempt.id}/answers`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answer }),
          }),
        ),
      )
      const response = await fetch(`/api/attempts/${attempt.id}/submit`, { method: "POST" })
      if (!response.ok) throw new Error("submit failed")

      if (examSessionId) {
        const advanceResponse = await fetch(`/api/exam-sessions/${examSessionId}/advance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ finishedSkill: test.skill }),
        })
        if (!advanceResponse.ok) throw new Error("advance failed")
        const outcome = await advanceResponse.json()
        router.push(outcome.done ? `/thi-thu-tong-hop/${examSessionId}/ket-qua` : `/bai-thi/${outcome.nextAttemptId}`)
      } else {
        router.push(`/ket-qua/${attempt.id}`)
      }
    } catch {
      toast.error("Không thể nộp bài, vui lòng thử lại")
      setIsSubmitting(false)
    }
  }, [attempt.id, examSessionId, router, test.skill])

  React.useEffect(() => {
    if (remainingSeconds <= 0) {
      const id = setTimeout(handleSubmit, 0)
      return () => clearTimeout(id)
    }
    const timeout = setTimeout(() => setRemainingSeconds((s) => s - 1), 1000)
    return () => clearTimeout(timeout)
  }, [remainingSeconds, handleSubmit])

  // Per-part countdown for Writing parts that contain a timed essay question —
  // purely informational, separate from the main exam timer, never auto-submits.
  const currentEssayTimeLimitSeconds = React.useMemo(() => {
    const essayQuestion = currentPart.questions.find(
      (question): question is EssayQuestion => question.type === "essay" && question.timeLimitMinutes != null,
    )
    return essayQuestion ? essayQuestion.timeLimitMinutes! * 60 : null
  }, [currentPart])

  const [essayTimerSeconds, setEssayTimerSeconds] = React.useState<number | null>(null)

  React.useEffect(() => {
    const id = setTimeout(() => setEssayTimerSeconds(currentEssayTimeLimitSeconds), 0)
    return () => clearTimeout(id)
  }, [currentPartIndex, currentEssayTimeLimitSeconds])

  React.useEffect(() => {
    if (essayTimerSeconds == null || essayTimerSeconds <= 0) return
    const timeout = setTimeout(() => setEssayTimerSeconds((s) => (s == null ? s : s - 1)), 1000)
    return () => clearTimeout(timeout)
  }, [essayTimerSeconds])

  return (
    <div className="relative flex h-screen flex-col">
      <header className="flex shrink-0 flex-col gap-3 border-b border-border/60 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-base font-medium">{SKILL_META[test.skill].shortLabel}</h1>
            {examSessionId ? (
              <p className="text-xs font-medium text-primary">
                Phần {MOCK_EXAM_SKILL_ORDER.indexOf(test.skill) + 1}/{MOCK_EXAM_SKILL_ORDER.length} ·{" "}
                {SKILL_META[test.skill].label} · Thi thử tổng hợp
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              Question {currentPartIndex + 1} of {parts.length}
              {essayTimerSeconds != null ? (
                <>
                  {" · "}
                  <TimerDisplay seconds={essayTimerSeconds} warnBelowSeconds={30} className="text-xs" />
                </>
              ) : null}
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex flex-col items-end rounded-2xl bg-muted/60 px-3 py-1.5 text-right">
              <TimerDisplay seconds={remainingSeconds} warnBelowSeconds={120} className="text-lg font-semibold" />
              <span className="text-[11px] text-muted-foreground">Time remaining</span>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleBookmarkToggle}>
              {isCurrentPartBookmarked ? <BookmarkCheckIcon /> : <BookmarkIcon />}
              Bookmark
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" disabled={isSubmitting}>
                  Nộp bài
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Nộp bài thi?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn đã trả lời {answeredCount}/{totalQuestions} câu. Sau khi nộp bài, bạn sẽ không thể
                    chỉnh sửa câu trả lời nữa.
                    {examSessionId
                      ? MOCK_EXAM_SKILL_ORDER.indexOf(test.skill) < MOCK_EXAM_SKILL_ORDER.length - 1
                        ? " Bạn sẽ chuyển sang phần tiếp theo của bài thi thử."
                        : " Đây là phần cuối cùng — bạn sẽ xem kết quả tổng hợp cả 4 kỹ năng."
                      : null}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Tiếp tục làm bài</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
                    Nộp bài
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <Progress value={progressPercent} />
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto w-full max-w-4xl">
          <PartContent part={currentPart} answers={answers} onAnswerChange={handleAnswerChange} />
        </div>
      </div>

      <BottomToolbar
        onOpenQuestionList={() => setIsQuestionListOpen(true)}
        currentPartInstructions={currentPart.instructions}
        canGoPrevious={currentPartIndex > 0}
        canGoNext={currentPartIndex < parts.length - 1}
        onPrevious={() => goToPart(Math.max(0, currentPartIndex - 1))}
        onNext={() => goToPart(Math.min(parts.length - 1, currentPartIndex + 1))}
        onExit={handleExit}
      />

      <QuestionListSheet
        open={isQuestionListOpen}
        onOpenChange={setIsQuestionListOpen}
        test={test}
        parts={parts}
        answers={answers}
        bookmarkedQuestionIds={bookmarkedQuestionIds}
        visitedPartIndices={visitedPartIndices}
        currentPartIndex={currentPartIndex}
        onJump={goToPart}
      />
    </div>
  )
}
