import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session/current-user"
import { getTestRepository } from "@/lib/data/provider"
import { MOCK_EXAM_SKILL_ORDER } from "@/lib/data/types"
import { ReadingTestRunner } from "@/components/test-runner/reading-test-runner"
import { ListeningTestRunner } from "@/components/test-runner/listening-test-runner"
import { WritingTestRunner } from "@/components/test-runner/writing-test-runner"
import { SpeakingTestRunner } from "@/components/test-runner/speaking-test-runner"

export default async function ExamPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params
  const user = await getCurrentUser()
  if (!user) redirect("/dang-nhap")

  const repository = getTestRepository()
  const attempt = await repository.getAttempt(attemptId)
  if (!attempt || attempt.userId !== user.id) notFound()

  if (attempt.status !== "in-progress") {
    if (attempt.examSessionId) {
      const session = await repository.getExamSession(attempt.examSessionId)
      if (session?.status === "completed") {
        redirect(`/thi-thu-tong-hop/${session.id}/ket-qua`)
      }
      const currentSkill = [...MOCK_EXAM_SKILL_ORDER].reverse().find((skill) => session?.attemptIds[skill])
      const currentAttemptId = currentSkill ? session?.attemptIds[currentSkill] : undefined
      if (currentAttemptId && currentAttemptId !== attempt.id) {
        redirect(`/bai-thi/${currentAttemptId}`)
      }
    }
    redirect(`/ket-qua/${attempt.id}`)
  }

  const test = await repository.getTest(attempt.testId)
  if (!test) notFound()

  const examSessionId = attempt.examSessionId

  switch (test.skill) {
    case "reading":
      return <ReadingTestRunner test={test} attempt={attempt} examSessionId={examSessionId} />
    case "listening":
      return <ListeningTestRunner test={test} attempt={attempt} examSessionId={examSessionId} />
    case "writing":
      return <WritingTestRunner test={test} attempt={attempt} examSessionId={examSessionId} />
    case "speaking":
      return <SpeakingTestRunner test={test} attempt={attempt} examSessionId={examSessionId} />
  }
}
