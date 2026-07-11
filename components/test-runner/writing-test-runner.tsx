import { TestRunnerShell } from "@/components/test-runner/test-runner-shell"
import type { Attempt, Test } from "@/lib/data/types"

// Short-answer/essay renderers (with live word-count) already handle
// Writing's long-form input needs generically. This wrapper is the
// per-skill entry point.
export function WritingTestRunner({
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
