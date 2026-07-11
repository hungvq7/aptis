import { TestRunnerShell } from "@/components/test-runner/test-runner-shell"
import type { Attempt, Test } from "@/lib/data/types"

// The audio player (currently a placeholder clip — see
// lib/data/mock/audio-config.ts) is rendered by PartContent whenever a part
// has an audioClipId. This wrapper is the per-skill entry point.
export function ListeningTestRunner({
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
