import { TestRunnerShell } from "@/components/test-runner/test-runner-shell"
import type { Attempt, Test } from "@/lib/data/types"

// Reading-specific behaviour (the passage/questions split view) lives in
// PartContent, driven by Part.passages — this wrapper exists as the
// per-skill entry point so app/bai-thi/[attemptId]/page.tsx can dispatch on
// test.skill, and so Reading-only chrome can be added here later without
// touching the shared shell.
export function ReadingTestRunner({
  test,
  attempt,
  examSessionId,
}: {
  test: Test
  attempt: Attempt
  examSessionId?: string
}) {
  return <TestRunnerShell test={test} attempt={attempt} examSessionId={examSessionId} />
}
