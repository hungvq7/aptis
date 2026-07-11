import { TestRunnerShell } from "@/components/test-runner/test-runner-shell"
import type { Attempt, Test } from "@/lib/data/types"

// The prep -> record -> playback flow (via hooks/use-media-recorder.ts) is
// self-contained inside SpeakingPromptQuestionRenderer, so each speaking
// prompt already behaves like a sequential mini flow within the shared
// shell's normal part/question layout. This wrapper is the per-skill entry
// point.
export function SpeakingTestRunner({
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
